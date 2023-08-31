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

  pesoM = [
    {
      label: '55 Kg o meno',
      peso: 55
    },
    {
      label: '65 Kg',
      peso: 65
    },
    {
      label: '70 Kg',
      peso: 70
    },
    {
      label: '75 Kg',
      peso: 75
    },
    {
      label: '80 Kg',
      peso: 80
    },
    {
      label: '90 Kg o più',
      peso: 90
    }
  ];

  pesoF = [
    {
      label: '45 Kg o meno',
      peso: 45
    },
    {
      label: '55 Kg',
      peso: 55
    },
    {
      label: '60 Kg',
      peso: 60
    },
    {
      label: '65 Kg',
      peso: 65
    },
    {
      label: '75 Kg',
      peso: 75
    },
    {
      label: '80 Kg o più',
      peso: 80
    }
  ];

  pesi = [] as any;


  constructor(
    private route: ActivatedRoute,
    private cookieDrunkService: CookieDrunkService,
    private libToastService: DrunkLibToastService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.chackUser();
  }

  getSesso(): boolean {
    if (!this.user) {
      return true;
    }
    if (!this.user?.sesso) {
      return true;
    }
    return false;
  }

  handlerChangeSesso(event: any) {
    console.log(event);
    switch (event) {
      case 'M':
        this.pesi = this.pesoM;
        break;
      case 'F':
        this.pesi = this.pesoF;
        break;
      default:
        this.pesi = [];
        break;
    }
    this.user.peso = null;
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
