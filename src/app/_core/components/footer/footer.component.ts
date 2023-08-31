import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MyApiService } from 'src/app/_core/services/my-api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  version?: any;
  constructor(
    private myApiService: MyApiService,
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

  getData() {
    this.myApiService.getData().subscribe((data: any) => {
      this.version = data.tag;
    });
  }
}
