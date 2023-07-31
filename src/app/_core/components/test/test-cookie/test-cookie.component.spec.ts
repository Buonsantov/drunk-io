import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCookieComponent } from './test-cookie.component';

describe('TestCookieComponent', () => {
  let component: TestCookieComponent;
  let fixture: ComponentFixture<TestCookieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestCookieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCookieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
