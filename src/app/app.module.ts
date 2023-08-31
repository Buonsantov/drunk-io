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
import { TestModule } from './_core/components/test/test.module';
import { ProfiloComponent } from './_core/components/profilo/profilo.component';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from './_core/directives/directives.module';
import { ProfiliComponent } from './_core/components/profili/profili.component';
import { CookieComponent } from './_core/components/cookie/cookie.component';
import { HomeComponent } from './_core/components/home/home.component';


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
        TestModule,
        DirectivesModule,
    ],
    providers: [
        [CookieService],
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: APP_INITIALIZER, useFactory: appInit, multi: true, deps: [ConfigService] }

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {
        sessionStorage.setItem(CONSTANTS.MF_KEYNAME, CONSTANTS.MF_VALUENAME);
    }
}
