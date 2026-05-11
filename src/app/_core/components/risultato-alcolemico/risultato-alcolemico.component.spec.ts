import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RisultatoAlcolemicoComponent } from './risultato-alcolemico.component';

describe('RisultatoAlcolemicoComponent', () => {
  let component: RisultatoAlcolemicoComponent;
  let fixture: ComponentFixture<RisultatoAlcolemicoComponent>;

  const mockTabella = [
    { min: 0, max: 0.5, sanzioni: 'Nessuna', effetti: 'Lieve euforia' },
    { min: 0.5, max: 1.0, sanzioni: 'Multa', effetti: 'Alterazione' },
  ];

  beforeEach(async () => {
    spyOn(window, 'scrollTo').and.stub();

    await TestBed.configureTestingModule({
      declarations: [RisultatoAlcolemicoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RisultatoAlcolemicoComponent);
    component = fixture.componentInstance;
    component.tabella = mockTabella;
    component.tasso = 0.3;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('trim', () => {
    it('dovrebbe ritornare 2 decimali per 0.255', () => {
      expect(component.trim(0.255)).toBe('0.25');
    });

    it('dovrebbe ritornare "0.00" per 0', () => {
      expect(component.trim(0)).toBe('0.00');
    });

    it('dovrebbe ritornare "" per null', () => {
      expect(component.trim(null as any)).toBe('');
    });
  });

  describe('retriveCalcolo', () => {
    it('dovrebbe impostare result quando tasso è nel range', () => {
      component.tasso = 0.3;
      component.retriveCalcolo();
      expect(component.result).toEqual(mockTabella[0]);
    });

    it('non dovrebbe impostare result quando tasso è fuori range', () => {
      component.tasso = 2.0;
      component.result = undefined;
      component.retriveCalcolo();
      expect(component.result).toBeUndefined();
    });
  });

  describe('backCalcolo', () => {
    it('dovrebbe emettere back con valore true', () => {
      let emitted: boolean | undefined;
      component.back.subscribe((val) => { emitted = val; });
      component.backCalcolo();
      expect(emitted).toBeTrue();
    });
  });
});
