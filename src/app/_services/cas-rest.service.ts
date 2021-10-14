import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User, Resource, Rdp, ActionResource, WebClient } from 'src/app/_models';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CasRestService {

  constructor(
      private http: HttpClient
    ) { }

  getCasUser(username: string, poolId?: number): Observable<User>{
    let params = new HttpParams();
    if  (poolId) {
      params = params.set('poolId', poolId.toString());
    }
    const endpoint = `users/${username}/rdp`;
    const apiURL = `${environment.casRestEndpointRoot}${endpoint}`;
    return this.http.get<User>(apiURL, {params});
  }
  getResources(username: string): Observable<{resources: Resource[]}>{
    const endpoint = `users/${username}/resources`;
    const apiURL = `${environment.casRestEndpointRoot}${endpoint}`;
    return this.http.get<{resources: Resource[]}>(apiURL);
  }
  getRdpbyResource(username: string, resourceType: string, resourceId: number, region?: string): Observable<Rdp>{
    username = encodeURIComponent(username);
    let params = new HttpParams();
    const endpoint = `user/${username}/resources/${resourceType}/${resourceId}`;
    if  (region) {
      params = params.set('region', region);
    }
    const apiURL = `${environment.casRestEndpointRoot}${endpoint}`;
    return this.http.get<Rdp>(apiURL, {params});
  }
  postActionResource(actionResource: ActionResource): Observable<null>{
    const username = encodeURIComponent(actionResource.username);
    const resourceType = encodeURIComponent(actionResource.resourceType);
    const region = encodeURIComponent(actionResource.region);
    const endpoint = `user/${username}/resources/${resourceType}/${actionResource.resourceId}/${region}/${actionResource.actionResource}`;
    const apiURL = `${environment.casRestEndpointRoot}${endpoint}`;
    return this.http.post<null>(apiURL, null);
  }
  public resetUserPassword(password: {value: string}): Observable<any> {
    const endpoint = `users/resetPassword`;
    const apiURL = `${environment.casRestEndpointRoot}${endpoint}`;
    return this.http.post<any>(apiURL, password);
  }
  public getRDWebClient(username: string): Observable<WebClient> {
    const endpoint = `users/${username}/webClient`;
    const apiURL = `${environment.casRestEndpointRoot}${endpoint}`;
    return this.http.get<WebClient>(apiURL);
  }
}
