import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoUpButtonComponent } from './go-up-button.component';
import { UtilityService } from '../../../_services/utility.service';

describe('GoUpButtonComponent', () => {
  let component: GoUpButtonComponent;
  let fixture: ComponentFixture<GoUpButtonComponent>;
  let utilitySpy: jasmine.SpyObj<UtilityService>;

  beforeEach(async () => {
    utilitySpy = jasmine.createSpyObj('UtilityService', ['randomNumber']);
    utilitySpy.randomNumber.and.returnValue('test-123');

    await TestBed.configureTestingModule({
      declarations: [GoUpButtonComponent],
      providers: [
        { provide: UtilityService, useValue: utilitySpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GoUpButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('topFunction', () => {
    it('dovrebbe chiamare window.scrollTo', () => {
      const scrollSpy = spyOn(window, 'scrollTo').and.stub();
      component.topFunction();
      expect(scrollSpy).toHaveBeenCalled();
    });
  });
});
