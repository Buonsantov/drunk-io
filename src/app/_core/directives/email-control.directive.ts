import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appEmailControl]',
  providers: [{ provide: NG_VALIDATORS, useExisting: EmailControlDirective, multi: true }]
})
export class EmailControlDirective implements Validator {

  regexEmail = new RegExp(
    '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$'
  );

  validate(control: AbstractControl): ValidationErrors | null {
    return control ? this.errorsEmail(control) : null;
  }

  errorsEmail(control: AbstractControl) {
    const email = control.value;
    if (email) {
      if (!this.regexEmail.test(email.toLowerCase())) {
        return ({ emailInvalid: true });
      }
    }

    return null;
  }
}

