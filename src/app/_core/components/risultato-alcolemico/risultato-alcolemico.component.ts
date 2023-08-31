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

  ngOnInit(): void {
    console.log(this.tabella);
  }

  backCalcolo() {
    this.back.emit(true);
  }


}
