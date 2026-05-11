import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { FooterComponent } from './footer.component';
import { VersionamentoMFApiImplService } from '../../services/API/versionamentoMFApiImpl.service';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let versionSpy: jasmine.SpyObj<VersionamentoMFApiImplService>;

  beforeEach(async () => {
    versionSpy = jasmine.createSpyObj('VersionamentoMFApiImplService', ['recuperaTagUsingGET']);
    versionSpy.recuperaTagUsingGET.and.returnValue(of({ tag: '1.0.0' }));

    await TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: VersionamentoMFApiImplService, useValue: versionSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
  }));

  it('dovrebbe impostare version dopo getData()', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component.version).toBe('1.0.0');
  }));
});
