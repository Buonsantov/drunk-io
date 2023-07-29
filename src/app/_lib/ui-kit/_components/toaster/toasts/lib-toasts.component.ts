import { Component, TemplateRef } from '@angular/core';
import { DrunkLibToastService } from '../_services/lib-toast.services';

@Component({
  selector: 'lib-toasts',
  templateUrl: './lib-toasts.component.html',
  styleUrls: ['./lib-toasts.component.scss'],
  // tslint:disable-next-line:no-host-metadata-property
  host: { '[class.ngb-toasts]': 'true' }
})
export class DrunkLibToastsComponent {

  isTemplate(toast: any) { return toast.textOrTpl instanceof TemplateRef; }
  constructor(
    public toasterService: DrunkLibToastService,
  ) { }



}
