import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.checkUserSelezionato();
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  checkUserSelezionato() {
    this.cookieDrunkService.getValueUser().subscribe((value) => {
      this.user = value;
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
