import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { VersionamentoMFApiImplService } from 'src/app/_core/services/API/versionamentoMFApiImpl.service';

@Injectable({
  providedIn: 'root'
})
export class TestResolverResolver implements Resolve<boolean> {

  constructor(
    private versionamentoMFApiImplService: VersionamentoMFApiImplService,
  ) { }
  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<Observable<any> | Promise<any> | any> {
    console.log('# Resolver INIT Test');
    const tag = await this.chiamaMetodoEsempioAsync();
    if (!tag) {
      return { error: 'Errore Generico' };
    }
    const dataResp = {
      tag
    };
    return dataResp;
  }


  async chiamaMetodoEsempioAsync() {
    console.log('# ApiTestComponent Async INIT');
    const response = await this.versionamentoMFApiImplService.recuperaTagUsingGET().toPromise();
    console.log('# ApiTestComponent Async Response: ', response);
    return response?.tag;
  }
}
