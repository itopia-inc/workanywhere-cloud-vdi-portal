import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {RegionInfoMail} from '../../_models';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelpSupportService {

  constructor(private http: HttpClient) {}

  public getRegionLatency(latencyUrl: string): Observable<string> {
    return this.http.get<string>(`${latencyUrl}`);
  }

  public sendEmail(params: RegionInfoMail, userName: string): Observable<{count: number, list: string[]}> {
    return this.http.post<{count: number, list: string[]}>(`${environment.casRestEndpointRoot}users/${userName}/sendEmail`, params);
  }
}
