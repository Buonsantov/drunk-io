import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoUpButtonComponent } from './go-up-button.component';

describe('GoUpButtonComponent', () => {
  let component: GoUpButtonComponent;
  let fixture: ComponentFixture<GoUpButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoUpButtonComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoUpButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
