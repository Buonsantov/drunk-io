import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDrunkService } from 'src/app/_lib/ui-kit/_components/modal/services/modal.service';

@Component({
  selector: 'app-test-form-resolver',
  templateUrl: './test-form-resolver.component.html',
  styleUrls: ['./test-form-resolver.component.scss']
})
export class TestFormResolverComponent implements OnInit {


  tag?: any;
  constructor(
    private activateRoute: ActivatedRoute,
    private genericModalService: ModalDrunkService,
  ) { }
  ngOnInit(): void {
    this.checkResolver();
  }

  handleChange() {
    console.log('Change Val: ', this.tag);
  }


  checkResolver() {
    const dataRecuperati = this.activateRoute.snapshot.data?.response;
    console.log('# TestFormResolverComponent dataRecuperati: ', dataRecuperati);
    const error = dataRecuperati?.error;
    if (error) {
      const messagge = 'ERRORE';
      this.genericModalService.openModalErrore(messagge);
    } else {
      this.tag = dataRecuperati?.tag;
      console.log('# TestFormResolverComponent resolver: ', this.tag);
    }
  }

}
