import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UppercaseDirective } from './UpperCaseDirective';
import { TrimValueAccessorDirective } from './Trim.directives';
import { NumberDirective } from './Number.directive';
import { EmailControlDirective } from './email-control.directive';
import { LowercaseDirective } from './LowerCase.directives';



@NgModule({
  declarations: [
    UppercaseDirective,
    TrimValueAccessorDirective,
    NumberDirective,
    EmailControlDirective,
    LowercaseDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    UppercaseDirective,
    TrimValueAccessorDirective,
    NumberDirective,
    EmailControlDirective,
    LowercaseDirective,
  ]
})
export class DirectivesModule { }
