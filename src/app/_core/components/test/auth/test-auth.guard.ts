import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieDrunkService } from 'src/app/_core/services/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class TestAuthGuard implements CanActivate {


  constructor(
    private cookieDrunkService: CookieDrunkService,
  ) {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    console.log('# GUARD INIT');
    const profilo = this.cookieDrunkService.getProfiloSelezionato();
    console.log('# GUARD profilo: ', profilo);
    if (profilo) {
      return true;
    } else {
      return false;
    }

  }

}
