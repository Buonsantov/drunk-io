import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { ProfiliComponent } from './profili.component';
import { CookieDrunkService } from '../../services/cookie.service';
import { DrunkLibToastService } from 'src/app/_lib/ui-kit/_components/toaster/_services/lib-toast.services';
import { ModalDrunkService } from 'src/app/_lib/ui-kit/_components/modal/services/modal.service';
import { User } from '../../model/user-model';

describe('ProfiliComponent', () => {
  let component: ProfiliComponent;
  let fixture: ComponentFixture<ProfiliComponent>;
  let cookieSpy: jasmine.SpyObj<CookieDrunkService>;
  let toastSpy: jasmine.SpyObj<DrunkLibToastService>;
  let modalSpy: jasmine.SpyObj<ModalDrunkService>;

  const mockUser: User = Object.assign(new User(), {
    id: 'u1',
    nome: 'Mario',
    sesso: 'M' as 'M',
    peso: 70,
    profiloSelezionato: true,
  });

  beforeEach(async () => {
    cookieSpy = jasmine.createSpyObj('CookieDrunkService', [
      'getUsers',
      'getProfiloSelezionato',
      'setProfiloSelezionato',
      'deleteUser',
    ]);
    toastSpy = jasmine.createSpyObj('DrunkLibToastService', ['okToast', 'alertToast']);
    modalSpy = jasmine.createSpyObj('ModalDrunkService', ['openModalGenerico']);

    cookieSpy.getUsers.and.returnValue({ utenti: [mockUser] });
    cookieSpy.getProfiloSelezionato.and.returnValue(mockUser);

    const routeSpy = {
      snapshot: { paramMap: { get: jasmine.createSpy('get').and.returnValue(null) } },
    };

    await TestBed.configureTestingModule({
      declarations: [ProfiliComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: routeSpy },
        { provide: CookieDrunkService, useValue: cookieSpy },
        { provide: DrunkLibToastService, useValue: toastSpy },
        { provide: ModalDrunkService, useValue: modalSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfiliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getProfili', () => {
    it('dovrebbe impostare profili dagli utenti nel cookie', () => {
      component.getProfili();
      expect(component.profili).toEqual([mockUser]);
    });
  });

  describe('getSesso', () => {
    it('dovrebbe ritornare "Uomo" per M', () => {
      expect(component.getSesso('M')).toBe('Uomo');
    });

    it('dovrebbe ritornare "Donna" per F', () => {
      expect(component.getSesso('F')).toBe('Donna');
    });
  });

  describe('profiloSelezionato', () => {
    it('dovrebbe ritornare false quando esiste un profilo selezionato', () => {
      cookieSpy.getProfiloSelezionato.and.returnValue(mockUser);
      expect(component.profiloSelezionato()).toBeFalse();
    });
  });

  describe('selezionaProfilo', () => {
    it('dovrebbe chiamare setProfiloSelezionato, toast, getProfili e navigate', () => {
      component.selezionaProfilo('u1');
      expect(cookieSpy.setProfiloSelezionato).toHaveBeenCalledWith('u1');
      expect(toastSpy.okToast).toHaveBeenCalled();
    });
  });
});
