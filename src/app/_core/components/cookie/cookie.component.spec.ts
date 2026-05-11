import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { CookieComponent } from './cookie.component';
import { CookieDrunkService } from '../../services/cookie.service';
import { DrunkLibToastService } from 'src/app/_lib/ui-kit/_components/toaster/_services/lib-toast.services';

describe('CookieComponent', () => {
  let component: CookieComponent;
  let fixture: ComponentFixture<CookieComponent>;
  let cookieSpy: jasmine.SpyObj<CookieDrunkService>;
  let toastSpy: jasmine.SpyObj<DrunkLibToastService>;
  let router: Router;

  beforeEach(async () => {
    cookieSpy = jasmine.createSpyObj('CookieDrunkService', ['recuperaInfo', 'salvaInfo']);
    toastSpy = jasmine.createSpyObj('DrunkLibToastService', ['alertToast', 'okToast']);
    cookieSpy.recuperaInfo.and.returnValue({ info: false, cookie: false });

    await TestBed.configureTestingModule({
      declarations: [CookieComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: CookieDrunkService, useValue: cookieSpy },
        { provide: DrunkLibToastService, useValue: toastSpy },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CookieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create e inizializzare info/cookie dal cookie service', () => {
    expect(component).toBeTruthy();
    expect(cookieSpy.recuperaInfo).toHaveBeenCalled();
  });

  describe('accetta', () => {
    it('dovrebbe chiamare alertToast quando info=false', () => {
      component.info = false;
      component.cookie = true;
      component.accetta();
      expect(toastSpy.alertToast).toHaveBeenCalled();
    });

    it('dovrebbe chiamare alertToast quando cookie=false', () => {
      component.info = true;
      component.cookie = false;
      component.accetta();
      expect(toastSpy.alertToast).toHaveBeenCalled();
    });

    it('dovrebbe navigare a / quando entrambi info e cookie sono true', () => {
      const navigateSpy = spyOn(router, 'navigate');
      component.info = true;
      component.cookie = true;
      component.accetta();
      expect(navigateSpy).toHaveBeenCalledWith(['/']);
    });
  });
});
