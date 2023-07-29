import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DrunkLibToastsComponent } from './toasts/lib-toasts.component';



@NgModule({
  declarations: [DrunkLibToastsComponent],
  imports: [
    CommonModule,
    NgbModule
  ],
  exports: [
    DrunkLibToastsComponent
  ]
})
export class DrunkLibToasterModule { }
