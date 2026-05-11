import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HeaderComponent } from './header.component';
import { CookieDrunkService } from '../../services/cookie.service';
import { User } from '../../model/user-model';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let cookieSpy: jasmine.SpyObj<CookieDrunkService>;

  const mockUser: User = Object.assign(new User(), {
    id: 'u1',
    nome: 'Mario',
    sesso: 'M' as 'M',
    peso: 70,
    profiloSelezionato: true,
  });

  beforeEach(async () => {
    cookieSpy = jasmine.createSpyObj('CookieDrunkService', ['getValueUser']);
    cookieSpy.getValueUser.and.returnValue(of(mockUser));

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: CookieDrunkService, useValue: cookieSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('dovrebbe impostare user dalla subscription a getValueUser', () => {
    expect(cookieSpy.getValueUser).toHaveBeenCalled();
    expect(component.user).toEqual(mockUser);
  });
});
