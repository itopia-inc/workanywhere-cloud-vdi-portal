import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import * as _ from 'underscore';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // add authorization header with token auth credentials if available
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.token && !request.url.includes('/rdp') &&
      _.all(environment.urlExcludeFromInterceptor, url => !request.url.startsWith(url))
    ) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
          'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE',
          'Content-Type': 'application/json;charset=utf-8',
          responseType: 'blob' as 'json'
        }
      });
    }
    return next.handle(request);
  }
}
