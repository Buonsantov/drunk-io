import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { HomeComponent } from './home.component';
import { APIMFApiImplService } from '../../services/API/APIMFApiImpl.service';
import { DrunkLibToastService } from 'src/app/_lib/ui-kit/_components/toaster/_services/lib-toast.services';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let apiSpy: jasmine.SpyObj<APIMFApiImplService>;
  let toastSpy: jasmine.SpyObj<DrunkLibToastService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('APIMFApiImplService', [
      'recuperaTabAlcolemicaUsingGET',
      'recuperaSanzioniUsingGET',
    ]);
    toastSpy = jasmine.createSpyObj('DrunkLibToastService', ['alertToast', 'okToast']);

    apiSpy.recuperaTabAlcolemicaUsingGET.and.returnValue(of([]));
    apiSpy.recuperaSanzioniUsingGET.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: APIMFApiImplService, useValue: apiSpy },
        { provide: DrunkLibToastService, useValue: toastSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
  }));

  describe('recuperaAPI', () => {
    it('dovrebbe impostare tabella, sanzioni e mostraCalcolo=true al successo', fakeAsync(() => {
      const mockTabella = [{ nome: 'Birra' }];
      const mockSanzioni = [{ min: 0, max: 0.5 }];
      apiSpy.recuperaTabAlcolemicaUsingGET.and.returnValue(of(mockTabella));
      apiSpy.recuperaSanzioniUsingGET.and.returnValue(of(mockSanzioni));

      fixture.detectChanges();
      tick();

      expect(component.tabella).toEqual(mockTabella);
      expect(component.sanzioni).toEqual(mockSanzioni);
      expect(component.mostraCalcolo).toBeTrue();
    }));

    it('dovrebbe chiamare alertToast in caso di errore', fakeAsync(() => {
      apiSpy.recuperaTabAlcolemicaUsingGET.and.returnValue(throwError(() => new Error('errore API')));

      fixture.detectChanges();
      tick();

      expect(toastSpy.alertToast).toHaveBeenCalled();
    }));
  });

  describe('handleRisultato', () => {
    it('dovrebbe impostare tasso=null e mostraCalcolo=event', () => {
      component.tasso = 0.5;
      component.handleRisultato(true);
      expect(component.tasso).toBeNull();
      expect(component.mostraCalcolo).toBeTrue();
    });
  });

  describe('handleTasso', () => {
    it('dovrebbe impostare mostraCalcolo=false e tasso=event', () => {
      component.handleTasso(0.5);
      expect(component.mostraCalcolo).toBeFalse();
      expect(component.tasso).toBe(0.5);
    });
  });
});
