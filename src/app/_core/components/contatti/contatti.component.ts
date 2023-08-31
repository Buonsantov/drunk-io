import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DrunkLibToastService } from 'src/app/_lib/ui-kit/_components/toaster/_services/lib-toast.services';
declare let Email: any;

@Component({
  selector: 'app-contatti',
  templateUrl: './contatti.component.html',
  styleUrls: ['./contatti.component.scss']
})
export class ContattiComponent implements OnInit {

  fromMail?: string;
  subject?: string;
  body?: string;
  @ViewChild('formValid') form!: NgForm;

  constructor(
    private libToastService: DrunkLibToastService,
  ) { }
  ngOnInit(): void {


  }

  reset() {
    this.fromMail = '';
    this.subject = '';
    this.body = '';
    this.form.resetForm();
  }

  sendMail() {

    if (this.form) {
      const controlsMod = this.form.controls;
      Object.keys(controlsMod).forEach(controlName => controlsMod[controlName].markAsTouched());
    }
    const valid = this.form.valid;
    if (!valid) {
      this.libToastService.alertToast('Inserire i campi obbligatori');
      return;
    }

    this.body = 'Mail from ' + this.fromMail + ' <br>' + this.body;
    const objSend = {
      Host: 'smtp.elasticemail.com',
      Username: 'buonsantovito@gmail.com',
      Password: '6D781D17CD74F848337A7C4F18384EF3A8FF',
      To: 'buonsantovito@outlook.it',
      From: 'buonsantovito@gmail.com',
      Subject: this.subject,
      Body: this.body
    };


    Email.send(objSend).then(
      (message: any) => {
        if (message === 'OK') {
          this.libToastService.okToast('Email inviata con successo');
          this.reset();
        } else {
          this.libToastService.alertToast('Errore durante l\'invio della mail. Si prega di riprovare');
        }
      }
    );
  }

}
