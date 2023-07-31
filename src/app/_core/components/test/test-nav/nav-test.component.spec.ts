import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavTestComponent } from './nav-test.component';

describe('NavTestComponent', () => {
  let component: NavTestComponent;
  let fixture: ComponentFixture<NavTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
