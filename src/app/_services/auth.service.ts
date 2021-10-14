import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { User } from '../_models/user';
import { Token } from '../_models/token';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: User;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.user = JSON.parse(sessionStorage.getItem('user'));
  }

  public setUserData( key: string, value: any ) {
    this.user[key] = value;
    sessionStorage.setItem('user', JSON.stringify(this.user));
  }

  signIn(username: string, password: string) {
    // TODO: Error-handling to try other gatewayAddresses if the first one fails.
    const gateway = environment.gatewayAddressUrl !== '' ? environment.gatewayAddressUrl : `https://${this.user.gatewayAddresses[0]}`;
    return this.http.post<Token>(`${gateway}/portalauth/api/v1/auth`, {username, password})
      .pipe(
        map(token => {
            this.setUserData('token', token.Token );
            this.setUserData('tokenExpiration', Date.now() + (token.Expiration * 60000));
        })
      );
  }

  signOut() {
    sessionStorage.removeItem('user');
    this.user = null;
    this.router.navigate(['/signin']);
    location.reload();
  }

  isSignedIn() {
    if ( this.user && (this.user.token && Date.now() < this.user.tokenExpiration ) ) {
      return true;
    }
    return false;
  }
}
