import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormioAppConfig } from '@formio/angular';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { AppComponent } from './app.component';
import { LocalizationServiceConfig } from './_lib/language/_services/Drunk-localization-config.service';
import { LocalizationService } from './_lib/language/_services/Drunk-localization.service';
import { LibUiKitModule } from './_lib/ui-kit/ui-kit.module';
import { I18nModule } from './_shared/i18n/i18n.module';


describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        I18nModule,
        RouterTestingModule,
        HttpClientTestingModule,
        LibUiKitModule,
        LoggerTestingModule,
      ],
      declarations: [
        AppComponent,
      ],
      providers: [
        FormioAppConfig,
        LocalizationService,
        LocalizationServiceConfig,
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
