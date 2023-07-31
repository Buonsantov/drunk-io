import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DrunkLibModalModule } from './_components/modal/generic-modal.module';
import { DrunkLibToasterModule } from './_components/toaster/lib-toaster.module';
import { GoUpButtonModule } from './_components/go-up-button/go-up-button.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    DrunkLibToasterModule,
    DrunkLibModalModule,
    GoUpButtonModule,
    NgbModule,
  ],
  exports: [
    DrunkLibToasterModule,
    DrunkLibModalModule,
    GoUpButtonModule,
  ],
  providers: [
  ]
})
export class LibUiKitModule { }
