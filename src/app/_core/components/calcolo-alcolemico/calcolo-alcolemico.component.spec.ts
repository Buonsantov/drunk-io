import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcoloAlcolemicoComponent } from './calcolo-alcolemico.component';

describe('CalcoloAlcolemicoComponent', () => {
  let component: CalcoloAlcolemicoComponent;
  let fixture: ComponentFixture<CalcoloAlcolemicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalcoloAlcolemicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalcoloAlcolemicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
