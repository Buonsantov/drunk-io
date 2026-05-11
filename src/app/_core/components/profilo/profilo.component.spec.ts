import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProfiloComponent } from './profilo.component';
import { CookieDrunkService } from '../../services/cookie.service';
import { DrunkLibToastService } from 'src/app/_lib/ui-kit/_components/toaster/_services/lib-toast.services';
import { User } from '../../model/user-model';

describe('ProfiloComponent', () => {
  let component: ProfiloComponent;
  let fixture: ComponentFixture<ProfiloComponent>;
  let cookieSpy: jasmine.SpyObj<CookieDrunkService>;
  let toastSpy: jasmine.SpyObj<DrunkLibToastService>;

  const mockUser: User = Object.assign(new User(), {
    id: 'user-1',
    nome: 'Mario',
    sesso: 'M' as 'M',
    peso: 70,
    profiloSelezionato: true,
  });

  function setupTestBed(routeId: string) {
    const routeSpy = {
      snapshot: { paramMap: { get: jasmine.createSpy('get').and.returnValue(routeId) } },
    };

    TestBed.resetTestingModule();
    return TestBed.configureTestingModule({
      declarations: [ProfiloComponent],
      imports: [RouterTestingModule, FormsModule],
      providers: [
        { provide: ActivatedRoute, useValue: routeSpy },
        { provide: CookieDrunkService, useValue: cookieSpy },
        { provide: DrunkLibToastService, useValue: toastSpy },
      ],
    }).compileComponents();
  }

  beforeEach(async () => {
    cookieSpy = jasmine.createSpyObj('CookieDrunkService', ['getUser', 'setUser']);
    toastSpy = jasmine.createSpyObj('DrunkLibToastService', ['okToast', 'alertToast']);
    cookieSpy.getUser.and.returnValue(mockUser);

    await setupTestBed('0');

    fixture = TestBed.createComponent(ProfiloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getSesso', () => {
    it('dovrebbe ritornare false quando user ha sesso impostato', () => {
      component.user = { sesso: 'M' };
      expect(component.getSesso()).toBeFalse();
    });

    it('dovrebbe ritornare true quando user non ha sesso', () => {
      component.user = {};
      expect(component.getSesso()).toBeTrue();
    });
  });

  describe('handlerChangeSesso', () => {
    beforeEach(() => {
      component.user = new User();
    });

    it('dovrebbe impostare pesi=pesoM e user.peso=null per M', () => {
      component.handlerChangeSesso('M');
      expect(component.pesi).toEqual(component.pesoM);
      expect(component.user.peso).toBeNull();
    });

    it('dovrebbe impostare pesi=pesoF e user.peso=null per F', () => {
      component.handlerChangeSesso('F');
      expect(component.pesi).toEqual(component.pesoF);
      expect(component.user.peso).toBeNull();
    });

    it('dovrebbe impostare pesi=[] e user.peso=null per valore non riconosciuto', () => {
      component.handlerChangeSesso('X');
      expect(component.pesi).toEqual([]);
      expect(component.user.peso).toBeNull();
    });
  });

  describe('chackUser', () => {
    it('dovrebbe creare un nuovo User con modify=false quando id=0', () => {
      expect(component.modify).toBeFalse();
      expect(component.user).toBeTruthy();
    });

    it('dovrebbe caricare utente dal cookie con modify=true quando id non è 0', async () => {
      await setupTestBed('user-1');
      fixture = TestBed.createComponent(ProfiloComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.modify).toBeTrue();
      expect(cookieSpy.getUser).toHaveBeenCalledWith('user-1');
    });
  });
});
