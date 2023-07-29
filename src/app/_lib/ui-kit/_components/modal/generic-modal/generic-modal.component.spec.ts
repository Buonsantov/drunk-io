import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GenericModalDrunkComponent } from './generic-modal.component';


describe('GenericModalComponent', () => {
  let component: GenericModalDrunkComponent;
  let fixture: ComponentFixture<GenericModalDrunkComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [GenericModalDrunkComponent],
        imports: [HttpClientTestingModule, RouterTestingModule, NgbModule],
        providers: []
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericModalDrunkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
