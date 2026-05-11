import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartComponent } from './chart.component';
import { CookieDrunkService } from '../../services/cookie.service';
import { DrunkLibToastService } from 'src/app/_lib/ui-kit/_components/toaster/_services/lib-toast.services';
import { ModalDrunkService } from 'src/app/_lib/ui-kit/_components/modal/services/modal.service';
import { User } from '../../model/user-model';

describe('ChartComponent', () => {
  let component: ChartComponent;
  let fixture: ComponentFixture<ChartComponent>;
  let cookieSpy: jasmine.SpyObj<CookieDrunkService>;
  let toastSpy: jasmine.SpyObj<DrunkLibToastService>;
  let modalSpy: jasmine.SpyObj<ModalDrunkService>;

  const mockUser: User = Object.assign(new User(), {
    id: 'u1',
    nome: 'Mario',
    sesso: 'M' as 'M',
    peso: 70,
    profiloSelezionato: true,
    bevute: [],
  });

  beforeEach(async () => {
    cookieSpy = jasmine.createSpyObj('CookieDrunkService', [
      'getProfiloSelezionato',
      'setUser',
    ]);
    toastSpy = jasmine.createSpyObj('DrunkLibToastService', ['okToast', 'alertToast']);
    modalSpy = jasmine.createSpyObj('ModalDrunkService', ['openModalGenerico']);
    cookieSpy.getProfiloSelezionato.and.returnValue(mockUser);

    await TestBed.configureTestingModule({
      declarations: [ChartComponent],
      providers: [
        { provide: CookieDrunkService, useValue: cookieSpy },
        { provide: DrunkLibToastService, useValue: toastSpy },
        { provide: ModalDrunkService, useValue: modalSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartComponent);
    component = fixture.componentInstance;

    // Stub lineChartMethod to avoid Chart.js DOM dependency
    spyOn(component, 'lineChartMethod').and.stub();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('numDaysBetween', () => {
    it('dovrebbe ritornare la differenza in giorni tra due date', () => {
      const d1 = new Date('2024-01-01');
      const d2 = new Date('2024-01-03');
      const result = component.numDaysBetween(d1, d2);
      expect(result).toBeCloseTo(2, 0);
    });
  });

  describe('calcolaGrafico', () => {
    it('dovrebbe impostare visualizza=true dopo la chiamata', () => {
      component.calcolaGrafico();
      expect(component.visualizza).toBeTrue();
    });
  });

  describe('confermaCancella', () => {
    it('dovrebbe chiamare setUser e okToast', () => {
      component.lineChart = { destroy: jasmine.createSpy('destroy') };
      component.confermaCancella();
      expect(cookieSpy.setUser).toHaveBeenCalled();
      expect(toastSpy.okToast).toHaveBeenCalled();
    });
  });
});
