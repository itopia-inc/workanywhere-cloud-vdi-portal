import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { User } from './../_models/user';
import { PasswordMatchValidator } from './../validators';
import { CasRestService } from '../_services/cas-rest.service';
import { AlertService } from '../_services/alert.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswForm: FormGroup;
  validationType = {};
  controls = ['ConfirmPassword', 'NewPassword'];
  passwordHide: boolean;
  isSubmited: boolean;
  confirmPasswordHide: boolean;
  errorPasswordsMatch = 'Passwords don\'t match';

  constructor(public dialogRef: MatDialogRef<ChangePasswordComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {user: User}, private formBuilder: FormBuilder,
              private casRestService: CasRestService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.isSubmited = false;
    const passwordValidators = [Validators.required];
    this.changePasswForm = this.formBuilder.group({
      NewPassword: [null],
      ConfirmPassword: [null]
    });
    this.validationType = {
      NewPassword: passwordValidators,
      ConfirmPassword: [PasswordMatchValidator(this.form.NewPassword)].concat(passwordValidators)
    };
    this.passwordHide = true;
    this.confirmPasswordHide = true;
  }
  get form() {
    return this.changePasswForm.controls;
  }
  setValidations(input?: string) {
    if (input) {
    this.form[input].setValidators(this.validationType[input]);
    this.form[input].markAsTouched();
    } else {
      this.controls.forEach((control: string) => {
        this.form[control].setValidators(this.validationType[control]);
        this.form[control].markAsTouched();
      });
    }
    this.changePasswForm.updateValueAndValidity();
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  changePassword(): void {
    this.isSubmited = true;
    if ( this.changePasswForm.invalid ) {
      this.isSubmited = false;
      return;
    }
    this.casRestService.resetUserPassword({value: this.form.NewPassword.value})
    .subscribe(
      () => {
        this.isSubmited = false;
        this.alertService.success('Password changed');
        this.onNoClick();
      },
      res => {
        this.isSubmited = false;
        this.alertService.error('Change Password failed');
      }
    );
  }
}
