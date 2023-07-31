import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFormResolverComponent } from './test-form-resolver.component';

describe('TestFormResolverComponent', () => {
  let component: TestFormResolverComponent;
  let fixture: ComponentFixture<TestFormResolverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestFormResolverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestFormResolverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
