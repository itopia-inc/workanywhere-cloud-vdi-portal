import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsoleService {
  public performingAction: Observable<boolean>;
  private performingAction$: BehaviorSubject<boolean>;
  public notReadyAction: Observable<boolean>;
  private notReady$: BehaviorSubject<boolean>;
  public isConfiguringIrdp: Observable<boolean>;
  private isConfiguringIrdp$: BehaviorSubject<boolean>;

  constructor() {
    this.performingAction$ = new BehaviorSubject<boolean>(false);
    this.performingAction = this.performingAction$.asObservable();
    this.notReady$ = new BehaviorSubject<boolean>(false);
    this.notReadyAction = this.notReady$.asObservable();
    this.isConfiguringIrdp$ = new BehaviorSubject<boolean>(false);
    this.isConfiguringIrdp = this.isConfiguringIrdp$.asObservable();
  }

  public setPerformingAction(performingAction: boolean): void {
    this.performingAction$.next(performingAction);
  }
  public setNotReadyAction(notReady: boolean): void {
    this.notReady$.next(notReady);
  }
  public setConfiguringIrdp(isConfiguringIrdp: boolean): void {
    this.isConfiguringIrdp$.next(isConfiguringIrdp);
  }
}
