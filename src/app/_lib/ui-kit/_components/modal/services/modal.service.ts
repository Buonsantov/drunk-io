import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ERRORI, THEME_COLORS_ENUM, UI_LABELS } from '../../../_models/constants';
import { ModalOption } from '../model/modal-option';
import { GenericModalDrunkComponent } from '../generic-modal/generic-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalDrunkService {
  customBtn = [] as any;
  constructor(private modalService: NgbModal) {
    this.customBtn = [];
    const btnAnnulla = {
      label: UI_LABELS.ANNULLA,
      style: THEME_COLORS_ENUM.PRIMARY_OUTLINE,
    };
    const btnContinua = {
      label: UI_LABELS.CONTINUA,
      style: THEME_COLORS_ENUM.PRIMARY,
    };
    this.customBtn.push(btnAnnulla);
    this.customBtn.push(btnContinua);
  }

  openModalGenerico(header: any, body: any, btnArray?: any, size?: 'sm' | 'lg' | 'xl', lang?: 'it-IT' | 'en-EN') {
    this.modalService.dismissAll();
    const opzioniEsistenzaPratiche = new ModalOption();
    opzioniEsistenzaPratiche.closable = false;
    opzioniEsistenzaPratiche.header = header;
    opzioniEsistenzaPratiche.body = body;
    opzioniEsistenzaPratiche.buttons = [];
    if (!btnArray) {
      if (lang && lang === 'en-EN') {
        (this.customBtn[0] as any).label = 'Cancel';
        (this.customBtn[1] as any).label = 'OK';
      }
      opzioniEsistenzaPratiche.buttons = this.customBtn;
    } else {
      btnArray.forEach((btn: any) => {
        opzioniEsistenzaPratiche.buttons.push(btn);
      });
    }
    const modalNotClosable: NgbModalOptions = { backdrop: 'static', keyboard: false, centered: true, size };
    const subject = new Subject<boolean>();
    const modal = this.modalService.open(GenericModalDrunkComponent, modalNotClosable);
    modal.componentInstance.options = opzioniEsistenzaPratiche;
    modal.componentInstance.subject = subject;
  }

  openModalErrore(body: any, btnArray?: any, noHome?: any, lang?: 'it-IT' | 'en-EN') {
    this.modalService.dismissAll();
    const opzioniEsistenzaPratiche = new ModalOption();
    opzioniEsistenzaPratiche.closable = false;
    opzioniEsistenzaPratiche.header = lang === 'en-EN' ? 'WARNING' : ERRORI.ATTENZIONE,
    opzioniEsistenzaPratiche.body = body;
    opzioniEsistenzaPratiche.buttons = [];
    if (!btnArray) {
      const routeLink = noHome ? null : '/home';
      opzioniEsistenzaPratiche.buttons.push({
        label: lang === 'en-EN' ? 'Close' : UI_LABELS.CHIUDI,
        route: routeLink as any,
        style: THEME_COLORS_ENUM.PRIMARY,
        functionBtn: null
      });
    } else {
      btnArray.forEach((btn: any) => {
        opzioniEsistenzaPratiche.buttons.push(btn);
      });
    }
    const modalNotClosable: NgbModalOptions = { backdrop: 'static', keyboard: false, centered: true };
    const subject = new Subject<boolean>();
    const modal = this.modalService.open(GenericModalDrunkComponent, modalNotClosable);
    modal.componentInstance.options = opzioniEsistenzaPratiche;
    modal.componentInstance.subject = subject;
  }
}


