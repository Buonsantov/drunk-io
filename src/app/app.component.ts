import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from './_core/services/config.service';
import { CONSTANTS } from './_shared/constants';
import { ModalDrunkService } from './_lib/ui-kit/_components/modal/services/modal.service';
import { THEME_COLORS_ENUM } from './_lib/ui-kit/_models/constants';
import { DrunkLibToastService } from './_lib/ui-kit/_components/toaster/_services/lib-toast.services';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {



  constructor(
    private configFile: ConfigService,
    private genericModalService: ModalDrunkService,
    private libToastService: DrunkLibToastService,

  ) { }

  async ngOnInit() {

  }

  ngOnDestroy(): void {
    sessionStorage.setItem(CONSTANTS.MF_KEYNAME, '');
  }

  // Inserisce un Servizio Frontend tramite chiamata
  async esempiofunction(data: any) {
    console.log('Modal: ', data);
  }

  // modale inviaSenzaCompilare noQualificata
  async openModale(data: any) {

    const funzioneConferma = async (): Promise<void> => {
      await this.esempiofunction(data);
    };
    const customBtn = [];
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
    const message = 'Esempio generico di messagio';

    this.genericModalService.openModalGenerico(
      'Attenzione',
      message,
      customBtn
    );
  }



  toastMessage(typeToast: string) {
    switch (typeToast) {
      case 'S':
        this.libToastService.okToast('Questo è un Toaster di Conferma');
        break;
      case 'W':
        this.libToastService.warningToast('Questo è un Toaster di Warning');
        break;
      case 'D':
        this.libToastService.alertToast('Questo è un Toaster di Errore');
        break;
      default:
        break;
    }

  }


}
