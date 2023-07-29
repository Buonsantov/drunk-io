import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../model/user-model';
import { Users } from '../model/users-model';

@Injectable({
  providedIn: 'root'
})
export class CookieDrunkService {

  constructor(
    private cookieService: CookieService,
  ) { }

  setUser(user: User) {
    let users = this.getUsers();
    if (users && users?.utenti && users?.utenti?.length) {
      const mod = this.getUser(user?.nome) as User;
      if (mod) {
        const x = (users.utenti.map((e: any) => e.nome).indexOf(user?.nome));
        (users.utenti as Array<any>).splice(x, 1);
      }
      users.utenti.push(user);
    } else {
      users = new Users();
      users.utenti = [];
      users.utenti.push(user);
    }
    this.setUsers(users);
  }

  getUser(nome: string) {
    const users = this.getUsers();
    if (users && users?.utenti && users?.utenti?.length) {
      const user = users.utenti.filter((u: any) => u.nome === nome);
      if (user) {
        return user[0];
      }
      return null;
    }
    return null;
  }

  setUsers(users: Users) {
    const objectString = JSON.stringify(users);
    this.cookieService.set('Users', objectString);
  }

  getUsers() {
    const obj = this.cookieService.get('Users');
    if (obj) {
      const retrievedObject = JSON.parse(obj);
      return retrievedObject;
    }
    return null;
  }


  getProfiloSelezionato() {
    const users = this.getUsers();
    if (users && users?.utenti && users?.utenti?.length) {
      const user = users.utenti.filter((u: any) => u.profiloSelezionato === true);
      if (user) {
        return user[0];
      }
      return null;
    }
    return null;
  }

  setProfiloSelezionato(nome: string) {
    const users = this.getUsers();
    if (users && users?.utenti && users?.utenti?.length) {
      const mod = this.getUser(nome) as User;
      const x = (users.utenti.map((e: any) => e.nome).indexOf(nome));
      if (mod && x) {
        users.utenti.forEach((e: User) => {
          e.profiloSelezionato = false;
        });
        mod.profiloSelezionato = true;
        (users.utenti as Array<any>).splice(x, 1, mod);
        this.setUsers(users);
      }
    }
  }
}
