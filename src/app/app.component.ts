import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ConfigService } from './_core/services/config.service';
import { CONSTANTS } from './_shared/constants';
import { filter } from 'rxjs';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {

  constructor(
    private configFile: ConfigService,
    private router: Router,
  ) { }

  async ngOnInit() {
    console.log('#config: ', this.configFile.getConfig());
    this.router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe(event => {
        if (
          event.id === 1 &&
          event.url === event.urlAfterRedirects
        ) {
          // Your code here for when the page is refreshd
          this.router.navigate(['/']);
        }
      });
  }

  ngOnDestroy(): void {
    sessionStorage.setItem(CONSTANTS.MF_KEYNAME, '');
  }

}
