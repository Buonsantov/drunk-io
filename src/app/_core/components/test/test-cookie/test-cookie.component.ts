import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_core/model/user-model';
import { CookieDrunkService } from 'src/app/_core/services/cookie.service';
import { ModalDrunkService } from 'src/app/_lib/ui-kit/_components/modal/services/modal.service';
import { THEME_COLORS_ENUM } from 'src/app/_lib/ui-kit/_models/constants';




@Component({
  selector: 'app-test-cookie',
  templateUrl: './test-cookie.component.html',
  styleUrls: ['./test-cookie.component.scss']
})
export class TestCookieComponent implements OnInit {
  users: User[] = [];
  constructor(
    private cookieDrunkService: CookieDrunkService,
    private modal: ModalDrunkService
  ) { }
  ngOnInit(): void {
    this.insertUsers();
  }

  insertUsers() {
    if (this.cookieDrunkService.getUsers()) {
      this.users = this.cookieDrunkService.getUsers().utenti;
      return;
    }
    console.log('#[Cookie] Init');
    const user = new User();
    user.nome = 'Vito Buonsanto';
    user.peso = 90;
    user.sesso = 'M';

    console.log('#[Cookie] User: ', user);

    this.cookieDrunkService.setUser(user);


    const user2 = new User();
    user2.nome = 'Fabrizio Favia';
    user2.peso = 60;
    user2.sesso = 'M';
    this.cookieDrunkService.setUser(user2);
    this.users = this.cookieDrunkService.getUsers().utenti;
  }

  selezionaProfilo(id: string): void {
    this.cookieDrunkService.setProfiloSelezionato(id);
  }

  cancella(id: string) {

    this.cookieDrunkService.deleteUser(id);
    this.users = this.cookieDrunkService.getUsers().utenti;
  }

  confermaCancella(id: string): void {

    const funzioneConferma = async (): Promise<void> => {
      await this.cancella(id);
    };

    const customBtn = [] as any;

    const btn = {
      label: 'Chiudi',
      style: THEME_COLORS_ENUM.PRIMARY_OUTLINE,
    };
    const btn2 = {
      label: 'Conferma',
      style: THEME_COLORS_ENUM.PRIMARY,
      functionBtn: funzioneConferma,
    };
    customBtn.push(btn);
    customBtn.push(btn2);
    this.modal.openModalGenerico('Attenzione', 'Sei sicuro di voler cancellare l\'utente?', customBtn, 'lg');
  }
}
