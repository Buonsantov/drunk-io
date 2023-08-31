import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DrunkLibToastService } from 'src/app/_lib/ui-kit/_components/toaster/_services/lib-toast.services';
import { APIMFApiImplService } from '../../services/API/APIMFApiImpl.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  tabella: any;
  sanzioni: any;
  tasso: any;
  mostraCalcolo = true;

  constructor(
    private router: Router,
    private libToastService: DrunkLibToastService,
    private apiMFApiImplService: APIMFApiImplService,
  ) {

  }
  async ngOnInit(): Promise<void> {
    await this.recuperaAPI();
  }


  async recuperaAPI() {
    try {
      this.tabella = await this.apiMFApiImplService.recuperaTabAlcolemicaUsingGET().toPromise();
      this.sanzioni = await this.apiMFApiImplService.recuperaSanzioniUsingGET().toPromise();
    } catch (error) {
      this.libToastService.alertToast('Errore durante il recupero delle informazioni.');
    }
  }

  handleRisultato(event: any){
    this.tasso = null;
    this.mostraCalcolo = event;
  }

  handleTasso(event: any){
    this.mostraCalcolo = false;
    this.tasso = event;
  }
}
