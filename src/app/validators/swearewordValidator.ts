import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function swearwordValidator(messageRe: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const forbidden = messageRe.test(control.value);
        return forbidden ? {forbiddenName: {value: control.value}} : null;
    };
}