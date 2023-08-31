import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieDrunkService } from '../services/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class ProfiloGuard implements CanActivate {
  constructor(
    private cookieDrunkService: CookieDrunkService,
    private router: Router,
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const users = this.cookieDrunkService.getUsers()?.utenti;
    if (users) {
      const profiloSel = this.cookieDrunkService.getProfiloSelezionato();
      if (!profiloSel) {
        this.router.navigate(['/profili']);
      }
    } else {
      this.router.navigate(['/profilo/0']);
    }
    return true;
  }

}
