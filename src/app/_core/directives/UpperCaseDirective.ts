import { Directive, ElementRef, HostListener } from '@angular/core';
@Directive({
    selector: '[appUppercase]',
})
export class UppercaseDirective {

    lastValue: string | undefined;

    constructor(public ref: ElementRef) { }

    @HostListener('input', ['$event']) onInput($event: any) {
        const start = $event.target.selectionStart;
        const end = $event.target.selectionEnd;
        $event.target.value = $event.target.value.toUpperCase();
        $event.target.setSelectionRange(start, end);
        $event.preventDefault();

        if ((!this.lastValue && this.lastValue !== '')
            || (this.lastValue && $event.target.value.length > 0 && this.lastValue !== $event.target.value)) {
            this.lastValue = this.ref.nativeElement.value = $event.target.value;
            // Propagation
            const evt = document.createEvent('HTMLEvents');
            evt.initEvent('input', false, true);
            // tslint:disable-next-line: deprecation
            if (event) {
                event.target?.dispatchEvent(evt);
            }
            evt.stopPropagation();
        }
    }
}
