import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericModalDrunkComponent } from './generic-modal/generic-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    GenericModalDrunkComponent
  ],
  imports: [
    CommonModule,
    NgbModule
  ],
  entryComponents: [
    GenericModalDrunkComponent
  ],
  exports: [
    GenericModalDrunkComponent
  ]
})
export class DrunkLibModalModule { }
