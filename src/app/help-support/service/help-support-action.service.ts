import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HelpSupportActionService {

  private disabledHelpSupportButton$ = new ReplaySubject<boolean>(1);
  public disabledHelpSupportButton = this.disabledHelpSupportButton$.asObservable();

  public setDisabledHelpSupportButton(disabled: boolean): void {
    this.disabledHelpSupportButton$.next(disabled);
  }
}
