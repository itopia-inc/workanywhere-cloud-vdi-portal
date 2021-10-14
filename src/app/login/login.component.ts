import { WebClient } from './../_models/webClient';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { first, map, catchError, timeout } from 'rxjs/operators';

import { User } from '../_models/user';
import { AuthService } from '../_services/auth.service';
import { CasRestService } from '../_services/cas-rest.service';
import { AlertService } from '../_services/alert.service';
import { Pool } from '../_models/pool';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  user = new User();
  loginStep: number;
  loginType: string;
  isSubmitted = false;
  isLoading = true;
  usernameRegEx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,6}\.[0-9]{1,6}\.[0-9]{1,6}\.[0-9]{1,6}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,6})|(([a-zA-Z\-0-9]){1,255}))$/;
  passwordHide = true;
  hasRdWebClient: boolean;
  validationType = {};
  controls = ['username', 'password', 'pool'];
  webClientUrl: string;
  isMultiplePools: boolean;
  collectionPools: Pool[];
  brandingConfigs = {
    title: environment.brandingConfig.appTitle,
    loginImage: environment.brandingConfig.appLoginImage
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private casRestService: CasRestService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    if (this.authService.isSignedIn) {
      this.router.navigateByUrl('/console');
    }
    this.loginStep = 1;
    this.isMultiplePools = false;
    this.collectionPools = [];
    this.loginForm = this.formBuilder.group({
      username: [null],
      password: [null],
      pool: [null]
    });
    this.isLoading = false;
    this.validationType = {
      username: [Validators.required, Validators.pattern(this.usernameRegEx)],
      password: [Validators.required],
      pool: [Validators.required]
    };
    this.checkGtwConfiguration();
  }

  get form(): any {
    return this.loginForm.controls;
  }

  setValidations(input?: string): void {
    if (input) {
      this.form[input].setValidators(this.validationType[input]);
      this.form[input].markAsTouched();
    } else {
      this.controls.forEach((control: string) => {
        this.form[control].setValidators(this.validationType[control]);
        this.form[control].markAsTouched();
      });
    }
    this.loginForm.updateValueAndValidity();
  }
  getCasUser(): void {
    this.setValidations('username');
    if (this.loginForm.controls.username.errors) {
      return;
    }
    this.isLoading = true;
    this.user.username = this.form.username.value;
    this.form.username.disable();
    if (this.form.pool.value) {
      this.form.pool.disable();
    }

    this.casRestService.getCasUser(this.user.username, this.form.pool.value)
      .pipe(first())
      .subscribe(user => {
        if (user) {
          this.authService.user = user;
          this.loginStep = 2;
          this.isLoading = false;
          this.user = Object.assign(this.user, this.authService.user);
          this.authService.user = this.user;
          if (this.authService.user.gatewayAddresses != null && this.authService.user.deploymentModern) {
            this.loginType = 'auth';
            this.loginForm.addControl('password', new FormControl(null, Validators.required));
          } else if (this.authService.user.rdpFileContents != null) {
            this.loginType = 'none';
          }
          this.checkRDWebClient();
          this.checkUserMultiplePools();
        } else {
          this.isLoading = false;
          this.form.username.enable();
          this.form.pool.enable();
          this.form.username.setErrors({ serverError: 'User not found' });
        }
      }, (error) => {
        this.form.username.enable();
        this.form.pool.enable();
        this.form.username.setErrors({ serverError: error });
        this.isLoading = false;
      });
  }

  submit() {
    this.isSubmitted = true;
    this.alertService.clear();
    this.setValidations('password');
    this.checkRDWebClient();
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.user = Object.assign(this.user, { password: this.form.password.value });
    this.authService.user = this.user;
    this.authService.signIn(this.form.username.value, this.form.password.value)
      .subscribe(
        () => {
          this.isLoading = false;
          this.router.navigateByUrl('/console');
        },
        res => {
          this.isLoading = false;
          this.form.password.setErrors({ serverError: 'Invalid password' });
          this.alertService.error(res.error ? res.error.message : 'Authentication failed');
        }
      );
  }

  downloadRdp() {
    if (this.authService.user.rdpFileContents) {
      const uri = `data:${this.authService.user.rdpFileContents.mimeType};base64,${this.authService.user.rdpFileContents.fileData}`;
      const downloadLink = document.createElement('a');
      downloadLink.href = uri;
      downloadLink.download = this.authService.user.rdpFileContents.fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } else {
      this.alertService.error(`Could not download RDP file`);
    }
  }

  public checkRDWebClient(): void {
    this.isLoading = true;
    const request = this.casRestService.getRDWebClient(this.user.username)
      .pipe(timeout(3000),
        map((webClient: WebClient) => {
          this.webClientUrl = webClient.url;
          this.hasRdWebClient = webClient.status === 200;
          this.isLoading = false;
        }
        ),
        catchError(err => {
          this.hasRdWebClient = false;
          this.isLoading = false;
          return err;
        })
      ).subscribe();
  }

  public changePool(): void {
    const updateValidity = ['username', 'pool'];
    updateValidity.forEach((control: string) => {
      this.form[control].updateValueAndValidity();
    });
  }

  private checkUserMultiplePools(): void {
    if (this.authService.user.rdpFileContents === null
      && this.authService.user.collections
      && this.authService.user.collections.length) {
      this.loginStep = 1;
      this.loginType = '';
      this.isMultiplePools = true;
      this.collectionPools = this.authService.user.collections;
      this.form.pool.setValue(this.collectionPools.length === 1 ? this.collectionPools[0].scaleId : null);
    }
  }

  private checkGtwConfiguration(): void {
    if (environment.gatewayAddressUrl !== '') {
      this.loginStep = 2;
      this.isMultiplePools = false;
      this.loginType = 'auth';
      this.webClientUrl = `${environment.gatewayAddressUrl}/portalauth/api/v1/auth`;
      this.hasRdWebClient = true;
    }
  }
}
