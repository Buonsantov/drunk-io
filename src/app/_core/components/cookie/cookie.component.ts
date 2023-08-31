import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DrunkLibToastService } from 'src/app/_lib/ui-kit/_components/toaster/_services/lib-toast.services';
import { CookieDrunkService } from '../../services/cookie.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cookie',
  templateUrl: './cookie.component.html',
  styleUrls: ['./cookie.component.scss']
})
export class CookieComponent {

  info = false;
  cookie = false;
  constructor(
    private router: Router,
    private libToastService: DrunkLibToastService,
    private cookieDrunkService: CookieDrunkService,
    private http: HttpClient,

  ) {
    const info = this.cookieDrunkService.recuperaInfo();
    this.info = info.info;
    this.cookie = info.cookie;
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

  accetta() {
    this.cookieDrunkService.salvaInfo(this.info, this.cookie);
    if (!this.info || !this.cookie) {
      if (!this.info) {
        this.libToastService.alertToast('Si prega di prendere visione dell\'informativa');
      }
      if (!this.cookie) {
        this.libToastService.alertToast('Si prega di accettare i Cookie');
      }
      return;
    } else {
      this.router.navigate(['/']);
    }

  }
}
