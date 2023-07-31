import { Component, OnInit } from '@angular/core';
import { ModalDrunkService } from 'src/app/_lib/ui-kit/_components/modal/services/modal.service';
import { DrunkLibToastService } from 'src/app/_lib/ui-kit/_components/toaster/_services/lib-toast.services';
import { THEME_COLORS_ENUM } from 'src/app/_lib/ui-kit/_models/constants';

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.scss']
})
export class TestComponentComponent implements OnInit {

  constructor(
    private genericModalService: ModalDrunkService,
    private libToastService: DrunkLibToastService,
  ) {

  }
  ngOnInit(): void {
    console.log('TEST-COMPONENT');
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
