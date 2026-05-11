import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { CookieDrunkService } from './cookie.service';
import { User } from '../model/user-model';
import { Users } from '../model/users-model';

describe('CookieDrunkService', () => {
  let service: CookieDrunkService;
  let cookieSpy: jasmine.SpyObj<CookieService>;

  beforeEach(() => {
    cookieSpy = jasmine.createSpyObj('CookieService', ['get', 'set', 'delete', 'deleteAll']);
    // Default: no cookies
    cookieSpy.get.and.returnValue('');

    TestBed.configureTestingModule({
      providers: [
        CookieDrunkService,
        { provide: CookieService, useValue: cookieSpy },
      ],
    });

    service = TestBed.inject(CookieDrunkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('salvaInfo', () => {
    it('dovrebbe chiamare cookieService.set con il JSON corretto', () => {
      service.salvaInfo(true, true);
      expect(cookieSpy.set).toHaveBeenCalledWith(
        'Informativa',
        JSON.stringify({ info: true, cookie: true }),
        30
      );
    });
  });

  describe('recuperaInfo', () => {
    it('dovrebbe parsare il cookie se esiste', () => {
      const infoObj = { info: true, cookie: true };
      cookieSpy.get.and.callFake((key: string) => {
        if (key === 'Informativa') { return JSON.stringify(infoObj); }
        return '';
      });
      const result = service.recuperaInfo();
      expect(result).toEqual(infoObj);
    });

    it('dovrebbe ritornare {info:false, cookie:false} se il cookie non esiste', () => {
      cookieSpy.get.and.returnValue('');
      const result = service.recuperaInfo();
      expect(result).toEqual({ info: false, cookie: false });
    });
  });

  describe('getValueUser / setValueUser', () => {
    it('getValueUser dovrebbe ritornare un Observable', () => {
      const obs = service.getValueUser();
      expect(obs).toBeTruthy();
      expect(typeof obs.subscribe).toBe('function');
    });

    it('setValueUser dovrebbe emettere il valore sull\'observable', (done) => {
      const mockUser = new User();
      mockUser.nome = 'Mario';
      service.getValueUser().subscribe((val) => {
        if (val) {
          expect(val.nome).toBe('Mario');
          done();
        }
      });
      service.setValueUser(mockUser);
    });
  });

  describe('setUsers / getUsers', () => {
    it('getUsers dovrebbe ritornare l\'oggetto parsato dal cookie', () => {
      const usersObj = { utenti: [] };
      cookieSpy.get.and.callFake((key: string) => {
        if (key === 'Users') { return JSON.stringify(usersObj); }
        return '';
      });
      const result = service.getUsers();
      expect(result).toEqual(usersObj);
    });

    it('getUsers dovrebbe ritornare null se il cookie non esiste', () => {
      cookieSpy.get.and.returnValue('');
      const result = service.getUsers();
      expect(result).toBeNull();
    });
  });

  describe('setUser', () => {
    it('dovrebbe creare un nuovo oggetto Users se non esistono utenti', () => {
      cookieSpy.get.and.returnValue('');
      const user = new User();
      user.nome = 'Luigi';
      service.setUser(user);
      expect(cookieSpy.set).toHaveBeenCalledWith(
        'Users',
        jasmine.stringMatching(/"nome":"Luigi"/),
        30
      );
    });

    it('dovrebbe aggiornare un utente esistente', () => {
      const user = new User();
      user.nome = 'Mario';
      const usersObj = { utenti: [{ id: user.id, nome: 'Mario_vecchio' }] };
      cookieSpy.get.and.callFake((key: string) => {
        if (key === 'Users') { return JSON.stringify(usersObj); }
        return '';
      });
      service.setUser(user);
      expect(cookieSpy.set).toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('dovrebbe ritornare l\'utente corrispondente all\'id', () => {
      const user = { id: 'test-id', nome: 'Mario' };
      const usersObj = { utenti: [user] };
      cookieSpy.get.and.callFake((key: string) => {
        if (key === 'Users') { return JSON.stringify(usersObj); }
        return '';
      });
      const result = service.getUser('test-id');
      expect(result).toEqual(user);
    });

    it('dovrebbe ritornare undefined se l\'utente non esiste', () => {
      const usersObj = { utenti: [{ id: 'other-id', nome: 'Luigi' }] };
      cookieSpy.get.and.callFake((key: string) => {
        if (key === 'Users') { return JSON.stringify(usersObj); }
        return '';
      });
      const result = service.getUser('non-esistente');
      expect(result).toBeFalsy();
    });
  });

  describe('getProfiloSelezionato', () => {
    it('dovrebbe ritornare l\'utente con profiloSelezionato=true', () => {
      const user1 = { id: 'u1', nome: 'Mario', profiloSelezionato: false };
      const user2 = { id: 'u2', nome: 'Luigi', profiloSelezionato: true };
      const usersObj = { utenti: [user1, user2] };
      cookieSpy.get.and.callFake((key: string) => {
        if (key === 'Users') { return JSON.stringify(usersObj); }
        return '';
      });
      const result = service.getProfiloSelezionato();
      expect(result).toEqual(user2 as any);
    });

    it('dovrebbe ritornare null se non ci sono utenti', () => {
      cookieSpy.get.and.returnValue('');
      const result = service.getProfiloSelezionato();
      expect(result).toBeNull();
    });
  });

  describe('setProfiloSelezionato', () => {
    it('dovrebbe impostare profiloSelezionato=true per l\'utente specificato', () => {
      const user1 = { id: 'u1', nome: 'Mario', profiloSelezionato: false };
      const usersObj = { utenti: [user1] };
      cookieSpy.get.and.callFake((key: string) => {
        if (key === 'Users') { return JSON.stringify(usersObj); }
        return '';
      });
      service.setProfiloSelezionato('u1');
      const savedArg = cookieSpy.set.calls.mostRecent().args[1];
      const saved = JSON.parse(savedArg);
      expect(saved.utenti[0].profiloSelezionato).toBeTrue();
    });
  });

  describe('deleteUser', () => {
    it('dovrebbe rimuovere l\'utente dall\'array', () => {
      const user1 = { id: 'u1', nome: 'Mario', profiloSelezionato: false };
      const user2 = { id: 'u2', nome: 'Luigi', profiloSelezionato: false };
      const usersObj = { utenti: [user1, user2] };
      cookieSpy.get.and.callFake((key: string) => {
        if (key === 'Users') { return JSON.stringify(usersObj); }
        return '';
      });
      service.deleteUser('u1');
      const savedArg = cookieSpy.set.calls.mostRecent().args[1];
      const saved = JSON.parse(savedArg);
      expect(saved.utenti.length).toBe(1);
      expect(saved.utenti[0].id).toBe('u2');
    });
  });

  describe('deleteAllCookies', () => {
    it('dovrebbe chiamare cookieService.deleteAll()', () => {
      service.deleteAllCookies();
      expect(cookieSpy.deleteAll).toHaveBeenCalled();
    });
  });

  describe('initUserExists', () => {
    it('dovrebbe chiamare setValueUser quando esiste un profilo selezionato', () => {
      const user = { id: 'u1', nome: 'Mario', profiloSelezionato: true };
      const usersObj = { utenti: [user] };
      cookieSpy.get.and.callFake((key: string) => {
        if (key === 'Users') { return JSON.stringify(usersObj); }
        return '';
      });
      const spy = spyOn(service, 'setValueUser');
      service.initUserExists();
      expect(spy).toHaveBeenCalled();
    });
  });
});
