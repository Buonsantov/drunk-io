import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { VersionamentoMFApiImplService } from '../../services/API/versionamentoMFApiImpl.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  version?: any;
  constructor(
    private versionamentoMFApiImplService: VersionamentoMFApiImplService,
    private http: HttpClient,
  ) {
    this.getData();
  }


  downloadPdf(): void {
    const pdfUrl = 'assets/pdf/tabella_alcolemica.pdf'; // Sostituisci con il percorso del tuo file PDF nell'assets folder

    this.http.get(pdfUrl, { responseType: 'blob' }).subscribe((response: Blob) => {
      const blob = new Blob([response], { type: 'application/pdf' });

      // Crea un oggetto URL dal blob
      const url = window.URL.createObjectURL(blob);

      // Crea un elemento <a> per il download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tabella_alcolemica.pdf'; // Puoi specificare il nome del file come preferisci

      // Simula il clic sull'elemento <a> per avviare il download
      a.click();

      // Rilascia l'URL creato
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Errore nel download del PDF', error);
    });
  }

  async getData() {
    const resp = await this.versionamentoMFApiImplService.recuperaTagUsingGET().toPromise();
    this.version = resp.tag;
  }
}
