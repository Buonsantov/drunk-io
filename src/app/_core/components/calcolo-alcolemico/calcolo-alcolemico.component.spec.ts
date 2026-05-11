import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalcoloAlcolemicoComponent } from './calcolo-alcolemico.component';
import { CookieDrunkService } from '../../services/cookie.service';
import { DrunkLibToastService } from 'src/app/_lib/ui-kit/_components/toaster/_services/lib-toast.services';
import { User } from '../../model/user-model';

describe('CalcoloAlcolemicoComponent', () => {
  let component: CalcoloAlcolemicoComponent;
  let fixture: ComponentFixture<CalcoloAlcolemicoComponent>;
  let cookieSpy: jasmine.SpyObj<CookieDrunkService>;
  let toastSpy: jasmine.SpyObj<DrunkLibToastService>;

  const mockUser: User = Object.assign(new User(), {
    id: 'user-1',
    nome: 'Mario',
    sesso: 'M' as 'M',
    peso: 70,
    profiloSelezionato: true,
    bevute: [],
  });

  const mockTabella = [
    {
      nome: 'Birra',
      gradazione: 5,
      dettaglioAlcolici: [
        { kg: 70, sesso: 'M', tasso: 0.3, stomacoPieno: false },
      ],
    },
  ];

  beforeEach(async () => {
    cookieSpy = jasmine.createSpyObj('CookieDrunkService', [
      'getProfiloSelezionato',
      'setUser',
      'getUsers',
    ]);
    toastSpy = jasmine.createSpyObj('DrunkLibToastService', ['okToast', 'alertToast']);
    cookieSpy.getProfiloSelezionato.and.returnValue(mockUser);

    spyOn(window, 'scrollTo').and.stub();

    await TestBed.configureTestingModule({
      declarations: [CalcoloAlcolemicoComponent],
      providers: [
        { provide: CookieDrunkService, useValue: cookieSpy },
        { provide: DrunkLibToastService, useValue: toastSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CalcoloAlcolemicoComponent);
    component = fixture.componentInstance;
    component.tabella = mockTabella;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getInDrinks', () => {
    it('dovrebbe ritornare true se il drink è nella lista', () => {
      component.drinkSelected = [{ id: 'Birra', num: 1, body: {} }];
      expect(component.getInDrinks('Birra')).toBeTrue();
    });

    it('dovrebbe ritornare false se il drink non è nella lista', () => {
      component.drinkSelected = [];
      expect(component.getInDrinks('Birra')).toBeFalse();
    });
  });

  describe('aggiungi', () => {
    it('dovrebbe incrementare il num del drink', () => {
      component.drinkSelected = [{ id: 'Birra', num: 1, body: {} }];
      component.aggiungi('Birra');
      expect(component.drinkSelected[0].num).toBe(2);
    });
  });

  describe('togli', () => {
    it('dovrebbe decrementare il num se maggiore di 1', () => {
      component.drinkSelected = [{ id: 'Birra', num: 2, body: {} }];
      component.togli('Birra');
      expect(component.drinkSelected[0].num).toBe(1);
    });

    it('non dovrebbe decrementare se num è 1', () => {
      component.drinkSelected = [{ id: 'Birra', num: 1, body: {} }];
      component.togli('Birra');
      expect(component.drinkSelected[0].num).toBe(1);
    });
  });

  describe('cancella', () => {
    it('dovrebbe rimuovere il drink da drinkSelected', () => {
      component.drinkSelected = [{ id: 'Birra', num: 1, body: {} }];
      component.cancella('Birra');
      expect(component.drinkSelected.length).toBe(0);
    });
  });

  describe('selectDrink', () => {
    it('dovrebbe aggiungere il drink con num=1', () => {
      component.drinkSelected = [];
      component.selectDrink({ nome: 'Birra' });
      expect(component.drinkSelected.length).toBe(1);
      expect(component.drinkSelected[0].num).toBe(1);
      expect(component.drinkSelected[0].id).toBe('Birra');
    });
  });

  describe('calcolo', () => {
    it('dovrebbe emettere tassoOut con il valore calcolato', () => {
      component.drinkSelected = [{ id: 'Birra', num: 1, body: {} }];
      cookieSpy.getProfiloSelezionato.and.returnValue(mockUser);
      let emittedValue: number | undefined;
      component.tassoOut.subscribe((val) => { emittedValue = val; });
      component.calcolo();
      expect(emittedValue).toBeDefined();
    });
  });

  describe('salvaAndamento', () => {
    it('dovrebbe chiamare cookieDrunkService.setUser', () => {
      cookieSpy.getProfiloSelezionato.and.returnValue(mockUser);
      component.salvaAndamento(0.5);
      expect(cookieSpy.setUser).toHaveBeenCalled();
    });
  });
});
