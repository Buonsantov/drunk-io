import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { CookieDrunkService } from '../../services/cookie.service';
import { ModalDrunkService } from 'src/app/_lib/ui-kit/_components/modal/services/modal.service';
import { DrunkLibToastService } from 'src/app/_lib/ui-kit/_components/toaster/_services/lib-toast.services';
import { THEME_COLORS_ENUM } from 'src/app/_lib/ui-kit/_models/constants';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements AfterViewInit {
  @ViewChild('lineCanvas') lineCanvas: ElementRef | undefined;
  lineChart: any;


  x = [0];
  y = [''] as any;
  visualizza = true;
  filtro = 31;

  valoriFiltro = [
    {
      val: 31,
      label: 'Mese'
    },
    {
      val: 7,
      label: 'Settimana'
    }
  ];

  constructor(
    private cookieDrunkService: CookieDrunkService,
    private modalDrunkService: ModalDrunkService,
    private libToastService: DrunkLibToastService,

  ) { }

  ngAfterViewInit(): void {
    this.calcolaGrafico();
  }

  calcolaGrafico() {
    this.visualizza = false;
    this.x = [0];
    this.y = [''];
    this.getAndamento();
    this.visualizza = true;
    this.lineChartMethod();
  }

  handlerChange(event: any) {
    this.lineChart.destroy();
    this.calcolaGrafico();
  }

  deleteAll() {
    this.cancella();
  }

  confermaCancella() {

    const user = this.cookieDrunkService.getProfiloSelezionato();
    if (user) {
      user.bevute = [] as any;
      this.cookieDrunkService.setUser(user);
    }
    this.lineChart.destroy();
    this.calcolaGrafico();
    this.libToastService.okToast('Dati cancellati correttamente');

  }

  getAndamento() {
    const user = this.cookieDrunkService.getProfiloSelezionato();
    let andamento = user?.bevute;
    if (!andamento || !andamento?.length) {
      andamento = [] as any;
    }

    andamento?.forEach(element => {
      if (element?.grado && element?.data) {
        const dataB = new Date(element.data).toLocaleString();
        const today = new Date().toLocaleString();
        if (this.numDaysBetween(new Date(element.data), new Date()) <= 31) {
          this.x.push(element.grado);
          this.y.push(dataB);
        }
      }
    });
  }


  numDaysBetween(d1: Date, d2: Date) {
    const diff = Math.abs(d1.getTime() - d2.getTime());
    return diff / (1000 * 60 * 60 * 24);
  }




  lineChartMethod() {
    this.lineChart = new Chart(this.lineCanvas?.nativeElement, {
      type: 'line',
      data: {
        labels: this.y,
        datasets: [
          {
            label: 'Nascondi',
            //  lineTension: 0.2,
            fill: true,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: this.x,
            spanGaps: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            position: 'top',
            text: 'Livello Alcolemico',
            color: '#666',
            font: {
              size: 12,
            },
          },

          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#999',
              font: {
                size: 14
              }
            },
          },
        },
      },
    });
  }




  cancella(): void {

    const funzioneConferma = async (): Promise<void> => {
      await this.confermaCancella();
    };

    const customBtn = [] as any;

    const btn = {
      label: 'Chiudi',
      style: THEME_COLORS_ENUM.PRIMARY_OUTLINE,
    };
    const btn2 = {
      label: 'Conferma',
      style: THEME_COLORS_ENUM.PRIMARY,
      functionBtn: funzioneConferma,
    };
    customBtn.push(btn);
    customBtn.push(btn2);
    this.modalDrunkService.openModalGenerico('Attenzione', 'Sei sicuro di voler cancellare tutti i dati raccolti?', customBtn, 'lg');
  }
}
