import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-risultato-alcolemico',
  templateUrl: './risultato-alcolemico.component.html',
  styleUrls: ['./risultato-alcolemico.component.scss']
})
export class RisultatoAlcolemicoComponent implements OnInit {

  @Input() tabella!: any;
  @Input() tasso!: any;
  @Output() back = new EventEmitter<boolean>();

  result: any;

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.retriveCalcolo();
  }

  trim(num: number) {
    if (num !== null && num !== undefined) {
      return num?.toFixed(3).slice(0, -1);
    }
    return '';
  }



  backCalcolo() {
    this.back.emit(true);
  }

  retriveCalcolo() {
    console.log('tasso: ', this.tasso);
    const r = this.tabella.filter((e: any) => this.tasso >= e.min && this.tasso <= e.max);
    if (r.length) {
      this.result = r[0];
    }
  }


}
