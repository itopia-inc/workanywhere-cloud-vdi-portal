import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { SpeedTestService } from 'ng-speed-test';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components/alert/alert.component';
import { AuthInterceptor } from './_services/auth.interceptor';
import { ResourceComponent } from './resource/resource.component';
import { ErrorInterceptor } from './_services/error.interceptor';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginComponent } from './login/login.component';
import { ConsoleComponent } from './console/console.component';
import { DesktopClientComponent } from './desktop-client/desktop-client.component';
import { RdWebClientComponent } from './rd-web-client/rd-web-client.component';
import { IrdpClientComponent } from './irdp-client/irdp-client.component';
import { HelpSupportComponent } from './help-support/help-support.component';
import { HelpSupportService } from './help-support/service/help-support.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CapitalizePipe } from './_pipes';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ConsoleComponent,
    AlertComponent,
    ResourceComponent,
    ChangePasswordComponent,
    DesktopClientComponent,
    RdWebClientComponent,
    IrdpClientComponent,
    HelpSupportComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatToolbarModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule,
    MatChipsModule,
    MatAutocompleteModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, position: { top: '25px', right: '-90px' } } },
    CookieService, HelpSupportService, SpeedTestService, CapitalizePipe
  ],
  entryComponents: [ChangePasswordComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
