import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { THEME_COLORS_ENUM } from '../../../_models/constants';
import { ModalOption } from '../model/modal-option';


@Component({
  selector: 'app-generic-modal',
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.scss']
})
export class GenericModalDrunkComponent {
  options?: ModalOption;
  subject?: Subject<boolean>;
  colori = THEME_COLORS_ENUM;

  constructor(public router: Router, public bsModalRef: NgbModal) { }

  async action(value = true, path?: string, functionBtn?: any) {
    if (functionBtn) {
      await functionBtn();
    }
    if (path) {
      this.router.navigate([path]);
    }
    this.bsModalRef.dismissAll();
    this.subject?.next(value);
    this.subject?.complete();
  }
}
