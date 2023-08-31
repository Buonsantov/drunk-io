import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DrunkLibToastService } from 'src/app/_lib/ui-kit/_components/toaster/_services/lib-toast.services';
import { CookieDrunkService } from '../../services/cookie.service';

@Component({
  selector: 'app-cookie',
  templateUrl: './cookie.component.html',
  styleUrls: ['./cookie.component.scss']
})
export class CookieComponent {

  info = false;
  cookie = false;
  constructor(
    private router: Router,
    private libToastService: DrunkLibToastService,
    private cookieDrunkService: CookieDrunkService,

  ) {
    const info = this.cookieDrunkService.recuperaInfo();
    this.info = info.info;
    this.cookie = info.cookie;
  }


  accetta() {
    this.cookieDrunkService.salvaInfo(this.info, this.cookie);
    if (!this.info || !this.cookie) {
      if (!this.info) {
        this.libToastService.alertToast('Si prega di prendere visione dell\'informativa');
      }
      if (!this.cookie) {
        this.libToastService.alertToast('Si prega di accettare i Cookie');
      }
      return;
    } else {
      this.router.navigate(['/']);
    }

  }
}
