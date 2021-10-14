import { CookieService } from 'ngx-cookie-service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';

import { ConsoleService } from '../console/console.service';
import { environment } from './../../environments/environment';

const timeoutValue = 2000;
@Component({
  selector: 'app-irdp-client',
  templateUrl: './irdp-client.component.html',
  styleUrls: ['./irdp-client.component.scss']
})
export class IrdpClientComponent implements OnInit {
  @Output()
  cookieChange = new EventEmitter<boolean>();

  cookieValue: string;
  hasIrdp: boolean;
  isConfiguringIrdp: boolean;
  soName: string;
  otherOSLabel: string;
  otherOS: string;
  isDownloading: boolean;
  isDownloadingOther: boolean;
  notSupported: boolean;
  notSupportedUrl: string;
  deviceInfo: DeviceInfo;

  constructor(private cookieService: CookieService, private consoleService: ConsoleService,
              private deviceService: DeviceDetectorService) {
   }

  ngOnInit(): void {
    this.isConfiguringIrdp = false;
    this.checkCookie();
    this.checkOS();
    this.otherOSLabel = `Download for ${this.otherOS} instead`;
  }
  setCookie() {
    this.hasIrdp = !this.hasIrdp;
    this.cookieService.set('irdpInstalled', this.hasIrdp.toString());
    this.cookieChange.emit(this.hasIrdp);
    if ( this.hasIrdp ) {
      this.setConfiguringIrdp();
    }
  }

  setConfiguringIrdp() {
    this.isConfiguringIrdp = !this.isConfiguringIrdp;
    this.consoleService.setConfiguringIrdp(this.isConfiguringIrdp);
  }
  downloadIrdp(isOther: boolean) {
    let fileName;
    if (!isOther){
      this.isDownloading = true;
      fileName = this.soName !== 'Linux' ? this.soName.indexOf('Mac') > -1  ? environment.irdp.macUrl :  environment.irdp.winUrl
    : environment.irdp.linuxUrl;
    } else {
      this.isDownloadingOther = true;
      fileName = this.soName !== 'Linux' ? this.soName.indexOf('Mac') > -1  ? environment.irdp.winUrl :  environment.irdp.macUrl
    : environment.irdp.winUrl;
    }
    window.open(fileName);
    setTimeout(() => {
      if (!isOther){
        this.isDownloading = false;
      } else {
        this.isDownloadingOther = false;
      }
    }, timeoutValue);
  }
  private checkCookie(){
    this.cookieValue = this.cookieService.get('irdpInstalled');
    this.hasIrdp = this.cookieValue === 'true';
  }
  private checkOS() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const os = this.deviceInfo.os.toLowerCase();
    switch (true) {
        case os.indexOf('win') >= 0: {
          this.soName = 'Windows 32/64 bit';
          this.otherOS = 'MacOS';
          this.notSupported = false;
          break;
        }
        case os.indexOf('mac') >= 0: {
            this.soName = 'MacOS';
            this.otherOS = 'Windows 32/64 bit';
            this.otherOSLabel = `Download for ${this.otherOS} instead`;
            this.notSupported = false;
            break;
        }
        case os.indexOf('lin') >= 0: {
          this.soName = 'Linux';
          this.otherOS = 'Windows 32/64 bit';
          this.otherOSLabel = `Download for ${this.otherOS} instead`;
          this.notSupported = false;
          break;
      }
      default: this.notSupported = true;
               if (os.indexOf('chrome') >= 0 || os.indexOf('android') >= 0){
                  this.notSupportedUrl = environment.rdp.ChromeOS;
                  this.soName = 'Android/ChromeOS';
               }
               if (os.indexOf('ios') >= 0){
                this.notSupportedUrl = environment.rdp.iOS;
                this.soName = 'iOS';
             }
               break;
    }
}
}
