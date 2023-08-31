import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DrunkLibToastService } from 'src/app/_lib/ui-kit/_components/toaster/_services/lib-toast.services';
import { v4 as uuidv4 } from 'uuid';
import { CookieDrunkService } from '../../services/cookie.service';
import { User } from '../../model/user-model';
@Component({
  selector: 'app-calcolo-alcolemico',
  templateUrl: './calcolo-alcolemico.component.html',
  styleUrls: ['./calcolo-alcolemico.component.scss']
})
export class CalcoloAlcolemicoComponent implements OnInit {

  @Input() tabella!: any;
  @Input() show!: any;
  tasso = 0;
  @Output() tassoOut = new EventEmitter<number>();
  drinks = [] as any;
  selected: any;
  drinkSelected = [] as any;
  user: User | null;
  stomaco = false;


  constructor(
    private libToastService: DrunkLibToastService,
    private cookieDrunkService: CookieDrunkService,
  ) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.user = this.cookieDrunkService.getProfiloSelezionato();
  }


  ngOnInit(): void {
    this.drinks = [...this.tabella];
  }

  getInDrinks(nome: string) {
    return this.drinkSelected.some((e: any) => e.id === nome);
  }

  aggiungi(nome: any) {

    this.drinkSelected.forEach((e: any) => {
      if (e.id === nome) {
        e.num += 1;
      }
    });

  }

  togli(nome: any) {
    this.drinkSelected.forEach((e: any) => {
      if (e.id === nome && e.num > 1) {
        e.num -= 1;
      }
    });
  }

  cancella(id: any) {
    const x = (this.drinkSelected.map((e: any) => e.id).indexOf(id));
    if (x >= 0) {
      (this.drinkSelected as Array<any>).splice(x, 1);
    }
  }

  selectDrink(event: any) {
    this.selected = null;
    const drink = {
      num: 1,
      id: event.nome,
      body: event,
    };
    this.drinkSelected.push(drink);
  }

  calcolo() {

    let tassoCalcolato = 0;
    if (this.drinkSelected?.length) {
      this.drinkSelected.forEach((e: any) => {
        const val = this.tabella.filter((f: any) => f.nome === e.id);
        if (val?.length === 1) {
          const dettaglio = val[0].dettaglioAlcolici.filter((d: any) =>
            d.kg === Number(this.user?.peso) && d.sesso === this.user?.sesso && this.stomaco === d.stomacoPieno);
          if (dettaglio?.length) {
            const t = dettaglio[0]?.tasso * e.num;
            tassoCalcolato += t;
          }
        }

      });
      this.tasso = tassoCalcolato;
      console.log(this.tasso);
      this.tassoOut.emit(this.tasso);
    }

  }


}
