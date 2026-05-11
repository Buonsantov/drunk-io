import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ContattiComponent } from './contatti.component';
import { DrunkLibToastService } from 'src/app/_lib/ui-kit/_components/toaster/_services/lib-toast.services';

describe('ContattiComponent', () => {
  let component: ContattiComponent;
  let fixture: ComponentFixture<ContattiComponent>;
  let toastSpy: jasmine.SpyObj<DrunkLibToastService>;

  beforeEach(async () => {
    toastSpy = jasmine.createSpyObj('DrunkLibToastService', ['okToast', 'alertToast']);

    await TestBed.configureTestingModule({
      declarations: [ContattiComponent],
      imports: [FormsModule],
      providers: [
        { provide: DrunkLibToastService, useValue: toastSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContattiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('reset', () => {
    it('dovrebbe azzerare fromMail, subject e body', () => {
      component.fromMail = 'test@test.com';
      component.subject = 'Oggetto';
      component.body = 'Corpo';
      // Mock form to avoid ngForm issues
      (component as any).form = { resetForm: jasmine.createSpy('resetForm') };
      component.reset();
      expect(component.fromMail).toBe('');
      expect(component.subject).toBe('');
      expect(component.body).toBe('');
    });
  });

  describe('sendMail', () => {
    it('dovrebbe chiamare alertToast quando il form è invalido', () => {
      (component as any).form = {
        controls: {},
        valid: false,
      };
      component.sendMail();
      expect(toastSpy.alertToast).toHaveBeenCalled();
    });
  });
});
