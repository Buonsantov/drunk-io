import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrunkLibToastService {
  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    // avoid duplicated messages
    if (!this.toasts.find(message => message.textOrTpl === textOrTpl)) {
      this.toasts.push({ textOrTpl, ...options });
      setTimeout(() => {
        this.remove(this.toasts.find(message => message.textOrTpl === textOrTpl));
      }, 3000);
    }
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  okToast(message: any) {
    this.show(message, { classname: 'bg-success text-light' });
  }

  alertToast(message: any) {
    this.show(message, { classname: 'bg-danger text-light' });
  }

  warningToast(message: any) {
    this.show(message, { classname: 'bg-warning text-light' });
  }

}
