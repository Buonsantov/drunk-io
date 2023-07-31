import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from './_core/services/config.service';
import { CONSTANTS } from './_shared/constants';
import { ModalDrunkService } from './_lib/ui-kit/_components/modal/services/modal.service';
import { THEME_COLORS_ENUM } from './_lib/ui-kit/_models/constants';
import { DrunkLibToastService } from './_lib/ui-kit/_components/toaster/_services/lib-toast.services';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {

  constructor(
    private configFile: ConfigService
  ) { }

  async ngOnInit() {
    console.log('#config: ', this.configFile.getConfig());
  }

  ngOnDestroy(): void {
    sessionStorage.setItem(CONSTANTS.MF_KEYNAME, '');
  }

}
