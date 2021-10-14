import { AbstractControl, ValidationErrors } from '@angular/forms';
import * as _ from 'underscore';

// custom validator to check that two fields match
export const PasswordMatchValidator = (otherControl: AbstractControl): ValidationErrors | null => {
  return (control: AbstractControl) => {
        const verifyMatch = (password?: string, otherPassword?: string) => {
            return _.isEmpty(password) || _.isEmpty(otherPassword) || password === otherPassword;
        };

        const isMatch = verifyMatch(control.value, otherControl.value);
        return isMatch ? null : { mustMatch: true };
    };
};
