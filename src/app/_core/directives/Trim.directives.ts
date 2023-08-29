import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    // tslint:disable-next-line:directive-selector
/* selector: '[asas]' */
    // tslint:disable-next-line:directive-selector
    selector: `
 input:not([type=checkbox]):not([type=radio]):not([type=password]):not([readonly]):not(.ng-trim-ignore)[formControlName],
 input:not([type=checkbox]):not([type=radio]):not([type=password]):not([readonly]):not(.ng-trim-ignore)[formControl],
 input:not([type=checkbox]):not([type=radio]):not([type=password]):not([readonly]):not(.ng-trim-ignore)[ngModel],
 :not([readonly]):not(.ng-trim-ignore)[ngDefaultControl]'
 `
})
export class TrimValueAccessorDirective {
    constructor(
        private el: ElementRef
    ) { }

    @HostListener('blur', ['$event.target.value']) onBlur(value: any) {
        if (this.el.nativeElement.value) {
            this.el.nativeElement.dataset.isfocused = false;
            this.el.nativeElement.value = this.el.nativeElement.value.trim();
            const input = this.el.nativeElement;
            input.value = this.el.nativeElement.value;
            input.dispatchEvent(new Event('input'));
        }

    }

    // tslint:disable-next-line:variable-name
    @HostListener('focus', ['$event.target.value', '$event']) onFocus(value: any, event: any) {
        if (this.el.nativeElement) {
            this.el.nativeElement.dataset.isfocused = true;
            this.el.nativeElement.select();
        }

    }
}
