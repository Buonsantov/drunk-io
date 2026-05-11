import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DrunkLibToastsComponent } from './lib-toasts.component';
import { DrunkLibToastService } from '../_services/lib-toast.services';

describe('DrunkLibToastsComponent', () => {
  let component: DrunkLibToastsComponent;
  let fixture: ComponentFixture<DrunkLibToastsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbModule],
      declarations: [DrunkLibToastsComponent],
      providers: [DrunkLibToastService],
    }).compileComponents();

    fixture = TestBed.createComponent(DrunkLibToastsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('isTemplate dovrebbe ritornare false per una stringa', () => {
    const result = component.isTemplate({ textOrTpl: 'messaggio' });
    expect(result).toBeFalse();
  });
});
