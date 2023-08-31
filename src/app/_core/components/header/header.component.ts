import { Component, OnInit } from '@angular/core';
import { MyApiService } from 'src/app/my-api.service';
import { Drink } from '../../model/drink-model';
import { User } from '../../model/user-model';
import { CookieDrunkService } from '../../services/cookie.service';





@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user?: User | null;
  drink?: Drink | null;


  constructor(
    private cookieDrunkService: CookieDrunkService,
    private myApiService: MyApiService
  ) { }

  ngOnInit(): void {
    this.checkUserSelezionato();


  }

  checkUserSelezionato() {
    this.cookieDrunkService.getValueUser().subscribe((value) => {
      this.user = value;
      console.log('#Header user: ', this.user);

    });
  }

  getDettaglio(profilo: User) {
    let dettaglio = '';
    switch (profilo.sesso) {
      case 'M':
        return dettaglio = 'Uomo ';
        break;
      case 'F':
        return dettaglio = 'Donna ';
        break;
      default:
        break;
    }
    dettaglio = dettaglio + ' - ' + profilo.peso + ' Kg.';
    return dettaglio;
  }

}
