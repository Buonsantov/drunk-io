import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrunkioPresentazioneComponent } from './drunkio-presentazione.component';

describe('DrunkioPresentazioneComponent', () => {
  let component: DrunkioPresentazioneComponent;
  let fixture: ComponentFixture<DrunkioPresentazioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrunkioPresentazioneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrunkioPresentazioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
