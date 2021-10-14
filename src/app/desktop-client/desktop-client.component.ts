import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-desktop-client',
  templateUrl: './desktop-client.component.html',
  styleUrls: ['./desktop-client.component.scss']
})
export class DesktopClientComponent implements OnInit {

  osName: string;
  macUrl: string;
  iOsUrl: string;
  chromeUrl: string;
  deviceInfo: DeviceInfo;
  isMac: boolean;
  isiOs: boolean;
  isChrome: boolean;

  constructor(private deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.checkOS();
    this.macUrl =  environment.rdp.MacOS;
    this.iOsUrl = environment.rdp.iOS;
    this.chromeUrl = environment.rdp.ChromeOS;
  }

  private checkOS() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.osName = this.deviceInfo.os.toLowerCase();
    this.isMac = this.osName.indexOf('mac') > - 1;
    this.isiOs = this.osName.indexOf('ios') > - 1;
    this.isChrome = this.osName.indexOf('chrome') > - 1 || this.osName.indexOf('android') > -1;
    console.log('deviceInfo', this.deviceInfo)
}

}
