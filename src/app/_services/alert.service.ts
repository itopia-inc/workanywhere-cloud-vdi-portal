import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Alert } from '../_models/alert';

const defaultOptions = {duration: 3000, verticalPosition: 'top', horizontalPosition: 'end'};

@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<Alert>();
    private defaultId = 'default-alert';

    constructor(private snackBar: MatSnackBar){}

    // enable subscribing to alerts observable
    onAlert(id = this.defaultId): Observable<Alert> {
        return this.subject.asObservable().pipe(filter(x => x && x.id === id));
    }

    // convenience methods
    success(message: string, options?: any) {
      this.snackBar.open(message, 'x', options ? options : Object.assign(defaultOptions, {panelClass: ['success-snackbar']}));
    }

    error(message: string, options?: any) {
      this.snackBar.open(message, 'x', options ? options : Object.assign(defaultOptions, {panelClass: ['error-snackbar']}));
    }

    info(message: string, options?: any) {
      this.snackBar.open(message, 'x', options ? options : Object.assign(defaultOptions, {panelClass: ['info-snackbar']}));
    }

    warn(message: string, options?: any) {
      this.snackBar.open(message, 'x', options ? options : Object.assign(defaultOptions, {panelClass: ['warn-snackbar']}));
    }

    // main alert method
    alert(alert: Alert) {
        alert.id = alert.id || this.defaultId;
        this.subject.next(alert);
    }

    // clear alerts
    clear() {
      this.snackBar.dismiss();
    }
}
