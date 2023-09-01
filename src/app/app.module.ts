import { registerLocaleData, APP_BASE_HREF } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { LibUiKitModule } from './_lib/ui-kit/ui-kit.module';
import { CONSTANTS } from './_shared/constants';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigService } from './_core/services/config.service';
import { ContentComponent } from './_core/components/content/content.component';
import { BrowserModule } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';
import { HeaderComponent } from './_core/components/header/header.component';
import { FooterComponent } from './_core/components/footer/footer.component';
import { ProfiloComponent } from './_core/components/profilo/profilo.component';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from './_core/directives/directives.module';
import { ProfiliComponent } from './_core/components/profili/profili.component';
import { CookieComponent } from './_core/components/cookie/cookie.component';
import { HomeComponent } from './_core/components/home/home.component';
import { FaqComponent } from './_core/components/faq/faq.component';
import { ContattiComponent } from './_core/components/contatti/contatti.component';
import { CalcoloAlcolemicoComponent } from './_core/components/calcolo-alcolemico/calcolo-alcolemico.component';
import { RisultatoAlcolemicoComponent } from './_core/components/risultato-alcolemico/risultato-alcolemico.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


require('moment/moment.js');

export function appInit(appConfigService: ConfigService) {
    return () => appConfigService.init();
}

@NgModule({
    declarations: [
        AppComponent,
        ContentComponent,
        HeaderComponent,
        FooterComponent,
        ProfiloComponent,
        ProfiliComponent,
        CookieComponent,
        HomeComponent,
        FaqComponent,
        ContattiComponent,
        CalcoloAlcolemicoComponent,
        RisultatoAlcolemicoComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        LibUiKitModule,
        FormsModule,
        NgbModule,
        NgSelectModule,
        RouterModule,
        DirectivesModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.production,
          // Register the ServiceWorker as soon as the application is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        }),
    ],
    providers: [
        [CookieService],
        { provide: APP_INITIALIZER, useFactory: appInit, multi: true, deps: [ConfigService] }

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {
        sessionStorage.setItem(CONSTANTS.MF_KEYNAME, CONSTANTS.MF_VALUENAME);
    }
}
