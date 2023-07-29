import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class UtilityService {

    sort(array: any) {
        return array.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
    }

    deepCopy(obj: any): any {
        let copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || 'object' !== typeof obj) {
            return obj;
        }
        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (let i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.deepCopy(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {} as any;
            for (const attr in obj) {
                if (obj.hasOwnProperty(attr)) {
                    copy[attr] = this.deepCopy(obj[attr]);
                }
            }
            return copy;
        }
        throw new Error('Unable to copy obj! Its type isn\'t supported.');
    }


    randomNumber(): string {
        const crypto = window.crypto;
        const array = new Uint32Array(1);
        crypto.getRandomValues(array); // Compliant for security-sensitive use cases
        const random = crypto.getRandomValues(array)[0];
        return random?.toString() ? random?.toString() : 'random1234';
    }

    // return true se il form è invalido
    checkValidityForm(ngForm: NgForm): any {
        const controls = ngForm?.controls;
        if (controls) {
            Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
        }
        return ngForm?.invalid;
    }
    // return true se il form e i fields form sono invalidi
    checkValidityForms(mapNgForm: Map<string, NgForm>) {
        let invalidFields = false;
        mapNgForm.forEach((value: NgForm, key: string) => {
            const invalid = this.checkValidityForm(value);
            if (invalid) {
                invalidFields = invalid;
                return invalid;
            }
        });
        return invalidFields;
    }

    childControlReady(form: Map<string, NgForm>, event: any, type?: string) {
        if (!form) {
            form = new Map([]);
        }
        if (event instanceof Map) {
            event.forEach((value: NgForm, key: string) => {
                form.set(key, value);
            });
        } else if (event instanceof NgForm && type) {
            form.set(type, event);
        } else {
            throw new Error('The child Type event isn\'t Map or NgForm');
        }
        return form;
    }
}
