import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieDrunkService } from '../services/cookie.service';

@Injectable({
  providedIn: 'root'
})
export class InformativaGuard implements CanActivate {
  constructor(
    private cookieDrunkService: CookieDrunkService,
    private router: Router,
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const informativa = this.cookieDrunkService.recuperaInfo();
    if (informativa.cookie && informativa.info) {
      return true;
    } else {
      this.router.navigate(['/informativa']);
    }
    return false;
  }

}
