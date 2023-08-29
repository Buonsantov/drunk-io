import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DrunkLibToastService } from 'src/app/_lib/ui-kit/_components/toaster/_services/lib-toast.services';
import { CookieDrunkService } from '../../services/cookie.service';
import { THEME_COLORS_ENUM } from 'src/app/_lib/ui-kit/_models/constants';
import { ModalDrunkService } from 'src/app/_lib/ui-kit/_components/modal/services/modal.service';

@Component({
  selector: 'app-profili',
  templateUrl: './profili.component.html',
  styleUrls: ['./profili.component.scss']
})
export class ProfiliComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private cookieDrunkService: CookieDrunkService,
    private libToastService: DrunkLibToastService,
    private router: Router,
    private modalDrunkService: ModalDrunkService,
  ) { }

  profili = [] as any;


  ngOnInit(): void {
    this.getProfili();
  }

  getProfili() {
    this.profili = this.cookieDrunkService.getUsers()?.utenti;
    console.log('profili: ', this.profili);
  }

  getSesso(sesso: string) {
    return sesso === 'M' ? 'Uomo' : 'Donna';
  }

  selezionaProfilo(id: string) {
    this.cookieDrunkService.setProfiloSelezionato(id);
    this.libToastService.okToast('Profilo selezionato correttamente');
    this.getProfili();
  }

  confermaCancella(id: string) {

    this.cookieDrunkService.deleteUser(id);
    this.libToastService.okToast('Profilo cancellato correttamente');
    this.getProfili();
  }

  cancella(id: string): void {

    const funzioneConferma = async (): Promise<void> => {
      await this.confermaCancella(id);
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
    this.modalDrunkService.openModalGenerico('Attenzione', 'Sei sicuro di voler cancellare l\'utente?', customBtn, 'lg');
  }

}
