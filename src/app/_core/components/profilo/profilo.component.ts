import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../model/user-model';
import { CookieDrunkService } from '../../services/cookie.service';
import { NgForm } from '@angular/forms';
import { DrunkLibToastService } from 'src/app/_lib/ui-kit/_components/toaster/_services/lib-toast.services';

@Component({
  selector: 'app-profilo',
  templateUrl: './profilo.component.html',
  styleUrls: ['./profilo.component.scss']
})
export class ProfiloComponent implements OnInit {

  user: any;
  modify = false;
  @ViewChild('formUtenteValid') formUtente!: NgForm;


  constructor(
    private route: ActivatedRoute,
    private cookieDrunkService: CookieDrunkService,
    private libToastService: DrunkLibToastService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.chackUser();
  }

  chackUser() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('id: ', id);
    if (id !== null && id === '0') {
      this.modify = false;
      this.user = new User();
    } else {
      this.modify = true;
      if (id) {
        this.user = this.cookieDrunkService.getUser(id);
      }
    }
    console.log('user: ', this.user);
  }


  salva() {
    if (this.formUtente) {
      const controlsMod = this.formUtente.controls;
      Object.keys(controlsMod).forEach(controlName => controlsMod[controlName].markAsTouched());
    }
    const valid = this.formUtente.valid;
    if (valid) {
      this.libToastService.okToast('Azione completata con successo.');
      console.log('user saved: ', this.user);
      this.cookieDrunkService.setUser(this.user);
      this.router.navigate(['/profili']);
    } else {
      this.libToastService.alertToast('Correggere gli errori.');
    }

  }



}
