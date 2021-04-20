import { Component, OnInit } from '@angular/core';
import { WindowRef } from '../../../../window-ref';
import {ArticleForm, IDemandeAchat, DemandeAchat} from '../../../../shared/model/articleForm.model';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import swal from 'sweetalert';
import 'datatables.net';
import { DemandeAchatService } from './demande-achat.service';


@Component({
  selector: 'app-demande-achat',
  templateUrl: './demande-achat.component.html',
  styleUrls: ['./demande-achat.component.less']
})
export class DemandeAchatComponent implements OnInit {
  public isCollapsed1 = false;
  public calculatedPageHeight: number;
  dtOptions: DataTables.Settings = {};
  dtOptionModal: DataTables.Settings[] = [];
  articleform = new ArticleForm();
  public currentElement: IDemandeAchat;

  // dataArray :
  cpt = 1;
  items: FormArray;
  tabDemande: Array<IDemandeAchat> = [];
  elt: IDemandeAchat;
  myArticle = this.fb.group({
    id: new  FormControl('', Validators.required) ,
    contact: new FormControl('', Validators.required) ,
    date: new FormControl('', Validators.required) ,
    lieu: new FormControl('', Validators.required) ,
    imputation: new FormControl('', Validators.required) ,
    fournisseur: new FormControl('', Validators.required) ,
    motif: new FormControl('', Validators.required) ,
    article: this.fb.array([ this.createArticles() ])
  });
  // form edit demande
  renameArticle = this.fb.group({
    contact: new FormControl() ,
    date: new FormControl() ,
    lieu: new FormControl() ,
    imputation: new FormControl() ,
    fournisseur: new FormControl() ,
    motif: new FormControl() ,
    article:  this.fb.array([])
  });

  constructor(private winRef: WindowRef, private fb: FormBuilder, private demandeService: DemandeAchatService) {

   }

  ngOnInit(): void {
    this.calculatedPageHeight = this.winRef.nativeWindow.innerHeight * 2;
    this.dtOptions = {
      info: false,
      paging: false,
      search: false,
      responsive: true,
      processing: true,
      searching: true,
    };
    this.dtOptionModal[0] = {
      info: false,
      paging: false,
      search: false,
      responsive: true,
      processing: false,
      searching: false,
    };
    this.articleform.id = 1;
    this.tabDemande = this.demandeService.getAll();
  }

  elementCourant(elt: DemandeAchat){
    this.currentElement = elt;
    // console.log(this.currentElement);
    this.renameArticle = this.fb.group({
      contact: new FormControl(this.currentElement.contact),
      date: new FormControl(this.currentElement.date) ,
      lieu: new FormControl(this.currentElement.lieu) ,
      imputation: new FormControl(this.currentElement.imputation) ,
      fournisseur: new FormControl(this.currentElement.fournisseur) ,
      motif: new FormControl(this.currentElement.motif) ,
      article:  this.fb.array(
        this.currentElement.article
    )
  });
    console.log (this.renameArticle );
  }

  createArticles(): FormGroup {
    return this.fb.group({
      reference: new FormControl('') ,
      designation: new FormControl('') ,
      quantite: new FormControl('') ,
      unite: new FormControl('') ,
    });

  }

  addArticles(): void {
    this.items = this.myArticle.get('article') as FormArray;
    this.items.push(this.createArticles());
    // console.log(this.items.length);
  }

  deleteArticle(idx: number){
    if(this.items.length != 1){
      this.items.removeAt(idx);
    }
  }

  addDemande() {
    this.tabDemande.push({
      "id": this.tabDemande.length + 1,
      "contact": this.myArticle.value.contact,
      "date": this.myArticle.value.date,
      "lieu": this.myArticle.value.lieu,
      "imputation": this.myArticle.value.imputation,
      "fournisseur": this.myArticle.value.fournisseur,
      "motif": this.myArticle.value.motif,
      "article": this.myArticle.value.article
    });
    // console.log(this.tabDemande);
    this.myArticle.reset();
    $('#fermerModal').click();
    swal('Depot ajouté avec succes', {
      icon: 'success',
    });
  }


  // edit demande
  editDemande(){
    this.tabDemande = this.tabDemande.map(
      (demandeItem) => {
        // console.log('mon tableau' + demandeItem.article);
        if (demandeItem.id === this.currentElement.id){
            demandeItem.contact = this.renameArticle.value.reference;
            demandeItem.date = this.renameArticle.value.date;
            demandeItem.lieu = this.renameArticle.value.lieu;
            demandeItem.imputation = this.renameArticle.value.imputation;
            demandeItem.fournisseur = this.renameArticle.value.fournisseur;
            demandeItem.motif = this.renameArticle.value.motif;
            demandeItem.article = this.renameArticle.value.article.map(article => {
              return this.fb.group({
                reference: [article.reference],
                designation: [article.designation],
                quantite: [article.quantite],
                unite: [article.unite],
              });
            });
        }
        return demandeItem;
      }
    );

    this.renameArticle.reset();
    $('#hideEditdemande').click();
    swal('modification demande avec succes', {
      icon: 'success',
    });
    console.log(this.tabDemande);
  }

  // suppression demande d'achat
  deleteDemande(dmd: DemandeAchat, index: number) {
    //  appel API delate
    swal({
      title: 'Suppression de demande',
      text: 'Etes Vous sure de vouloir supprimer cette demande?',
      icon: 'warning',
      buttons: ['Annuler', 'Supprimer'],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.tabDemande = this.tabDemande.filter(item => item.id !== dmd.id) ;
        swal('Demande supprimée avec succes', {
          icon: 'success',
        });
      } else {
        swal('Suppession annulée');
      }
    });
  }

}
