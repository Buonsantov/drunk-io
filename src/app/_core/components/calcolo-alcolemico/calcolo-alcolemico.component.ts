import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DrunkLibToastService } from 'src/app/_lib/ui-kit/_components/toaster/_services/lib-toast.services';

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


  constructor(
    private libToastService: DrunkLibToastService,
  ) {

  }


  ngOnInit(): void {
    console.log(this.tabella);
  }


  calcolo() {
    this.tasso = 3;
    this.tassoOut.emit(this.tasso);
  }


}
