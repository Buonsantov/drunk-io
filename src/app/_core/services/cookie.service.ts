import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../model/user-model';
import { Users } from '../model/users-model';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CookieDrunkService {

  private userSelezionato: BehaviorSubject<User | null>;

  constructor(
    private cookieService: CookieService,
  ) {
    this.userSelezionato = new BehaviorSubject<any>(null);
    this.initUserExists();
    
  }

  getValueUser(): Observable<User | null> {
    return this.userSelezionato.asObservable();
  }
  setValueUser(user: User | null): void {
    this.userSelezionato.next(user);
  }

  initUserExists(){
    const users = this.getUsers();
    if (users && users?.utenti && users?.utenti?.length)
    {
      const user = this.getProfiloSelezionato(); 
      if (user) {
        this.setValueUser(user);
      }
    }
  }

  setUser(user: User) {
    let users = this.getUsers();
    if (users && users?.utenti && users?.utenti?.length) {
      const mod = this.getUser(user?.id) as User;
      if (mod) {
        const x = (users.utenti.map((e: any) => e.id).indexOf(user?.id));
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

  getUser(id: string) {
    const users = this.getUsers();
    if (users && users?.utenti && users?.utenti?.length) {
      const user = users.utenti.filter((u: any) => u.id === id);
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


  getProfiloSelezionato(): User | null {
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

  setProfiloSelezionato(id: string) {
    const users = this.getUsers();
    if (users && users?.utenti && users?.utenti?.length) {
      const mod = this.getUser(id) as User;
      const x = (users.utenti.map((e: any) => e.id).indexOf(id));
      if (mod && x>=0) {
        users.utenti.forEach((e: User) => {
          e.profiloSelezionato = false;
        });
        mod.profiloSelezionato = true;
        this.setValueUser(mod);
        (users.utenti as Array<any>).splice(x, 1, mod);
        this.setUsers(users);
      }
    }
  }

  deleteAllCookies(){
    this.cookieService.deleteAll();
  }

  deleteUser(id: string){
    const users = this.getUsers();
    if (users && users?.utenti && users?.utenti?.length){
      const mod = this.getUser(id) as User;
      const x = (users.utenti.map((e: any) => e.id).indexOf(id));
      if (mod && x>=0){
        (users.utenti as Array<User>).splice(x, 1);
        this.setUsers(users);
        this.setValueUser(this.getProfiloSelezionato());
      }
    }
  }

}
