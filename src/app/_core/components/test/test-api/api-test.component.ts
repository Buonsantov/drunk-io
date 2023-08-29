import { Component, OnInit } from '@angular/core';
import { VersionamentoMFApiImplService } from 'src/app/_core/services/API/versionamentoMFApiImpl.service';

@Component({
  selector: 'app-api-test',
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.scss']
})
export class ApiTestComponent implements OnInit {

  tag = '';
  constructor(
    private versionamentoMFApiImplService: VersionamentoMFApiImplService,
  ) { }

  async ngOnInit(): Promise<void> {
    /* await this.chiamaMetodoEsempioAsync(); */
    this.chiamaMetodoEsempioObservables();
  }


  async chiamaMetodoEsempioAsync() {

    console.log('# ApiTestComponent Async INIT');
    const response = await this.versionamentoMFApiImplService.recuperaTagUsingGET().toPromise();
    console.log('# ApiTestComponent Async Response: ', response);
    this.tag = response?.tag;
  }

  chiamaMetodoEsempioObservables() {

    console.log('# ApiTestComponent Observables INIT');
    this.versionamentoMFApiImplService.recuperaTagUsingGET().subscribe((response: any) => {
      console.log('# ApiTestComponent Observables Response: ', response);
      this.tag = response?.tag;
    });


  }


}
