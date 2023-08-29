import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
@Directive({
    selector: '[ngModel][appLowercase]'
})
export class LowercaseDirective {
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    value: any;

    @HostListener('input', ['$event']) onInputChange($event: any) {
        this.value = $event.target.value.toLowerCase();
        this.ngModelChange.emit(this.value);
    }
}
