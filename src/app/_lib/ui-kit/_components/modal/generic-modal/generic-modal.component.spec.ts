import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GenericModalDrunkComponent } from './generic-modal.component';

describe('GenericModalDrunkComponent', () => {
  let component: GenericModalDrunkComponent;
  let fixture: ComponentFixture<GenericModalDrunkComponent>;
  let modalSpy: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    modalSpy = jasmine.createSpyObj('NgbModal', ['open', 'dismissAll']);

    await TestBed.configureTestingModule({
      declarations: [GenericModalDrunkComponent],
      imports: [RouterTestingModule, NgbModule],
      providers: [
        { provide: NgbModal, useValue: modalSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GenericModalDrunkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('action', () => {
    it('dovrebbe chiamare dismissAll', async () => {
      await component.action(true);
      expect(modalSpy.dismissAll).toHaveBeenCalled();
    });
  });
});
