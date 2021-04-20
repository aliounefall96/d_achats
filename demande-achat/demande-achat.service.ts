import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core/services/http.service';
import { DemandeAchat } from 'src/app/shared/model/articleForm.model';
@Injectable({
  providedIn: 'root'
})
export class DemandeAchatService {

  constructor(private httpService : HttpService ) { }

  public getAll(): DemandeAchat[]{
    return [{
      id: 1,
      contact: 'Contact TEST',
      lieu: 'Dakar',
      fournisseur: 'frnsr TEST',
      date: '2021-04-07',
      imputation: 'impt TEST',
      motif: 'Nous espérons que cette demande de délai exceptionnel ne vous empêchera pas de maintenir votre commande.',
      article: [{
        id: 1,
        reference: 'ref-1',
        designation: 'Désignation 1',
        quantite: 54,
        unite: 'T',
      }]
    },{
      id: 2,
      contact: 'btp TEST',
      lieu: 'Diourbel',
      fournisseur: 'fournisseur TEST',
      date: '2020-11-07',
      imputation: 'imputation TEST',
      motif: 'TEST Veuillez agréer, Madame ou Monsieur, nos salutations distinguées.',
      article: [{
        id: 1,
        reference: 'REF-OO1',
        designation: 'Dégignation 3',
        quantite: 12,
        unite: 'KG',
      }]
    }]
  }
}
