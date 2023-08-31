import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RisultatoAlcolemicoComponent } from './risultato-alcolemico.component';

describe('RisultatoAlcolemicoComponent', () => {
  let component: RisultatoAlcolemicoComponent;
  let fixture: ComponentFixture<RisultatoAlcolemicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RisultatoAlcolemicoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RisultatoAlcolemicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
