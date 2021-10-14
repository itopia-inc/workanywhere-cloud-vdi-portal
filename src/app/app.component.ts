import { Component } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Cloud Desktop Launcher';

  constructor(
    private authService: AuthService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      `desktop`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/desktop.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `app`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/app.svg')
    );
  }
}
