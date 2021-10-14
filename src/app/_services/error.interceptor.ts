import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';

const unAuthorized = 401;

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe((catchError(err => {
      switch (err.status) {
       case unAuthorized:
              if (err.url.indexOf('/portalauth') === -1) {
               this.authService.signOut();
               break;
              }
              const errors = err.error.message || err.statusText;
              return throwError(errors);
       default:
                 const error = err.error.message || err.statusText;
                 return throwError(error);
     }
   })))
  }
}
