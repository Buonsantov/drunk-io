import { AfterViewInit, Component, Input } from '@angular/core';
import { UtilityService } from './../../../_services/utility.service';


@Component({
  selector: 'lib-go-up-button',
  templateUrl: './go-up-button.component.html',
  styleUrls: ['./go-up-button.component.scss']
})
export class GoUpButtonComponent implements AfterViewInit {

  @Input() id = this.utilityService.randomNumber();
  mybutton?: any;

  constructor(private utilityService: UtilityService) {
  }
  ngAfterViewInit(): void {
    this.mybutton = document.getElementById(this.id + 'myBtn');
  }

  scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      this.mybutton?.classList.add('goToTop-zoom');
    } else {
      this.mybutton?.classList.remove('goToTop-zoom');
    }
  }

  topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
