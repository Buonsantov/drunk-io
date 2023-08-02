import { Component, OnInit } from '@angular/core';
import { CookieDrunkService } from '../../services/cookie.service';
import { User } from '../../model/user-model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user?: User | null;

  constructor(
    private cookieDrunkService: CookieDrunkService,
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
        dettaglio = 'Uomo ';
        break;
      case 'F':
        dettaglio = 'Donna ';
        break;
      default:
        break;
    }

    dettaglio = dettaglio + ' - ' + profilo.peso + ' Kg.';
    return dettaglio;
  }

}
