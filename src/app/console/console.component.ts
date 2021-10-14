import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';

import { AuthService } from '../_services/auth.service';
import { User } from '../_models/user';
import { AlertService } from '../_services/alert.service';
import { CasRestService } from '../_services/cas-rest.service';
import { Resource } from './../_models/resource';
import { Subject, Observable, PartialObserver, interval } from 'rxjs';
import { catchError, finalize, map, takeUntil } from 'rxjs/operators';

import { ActionResource } from '../_models/actionResource';
import { ConsoleService } from './console.service';
import { Rdp } from '../_models/rdp';
import { ChangePasswordComponent } from './../change-password/change-password.component';
import { Region } from '../_models/region';
import { HelpSupportActionService } from '../help-support/service/help-support-action.service';
import { environment } from '../../environments/environment';
import { ImportFrom } from '../_enums';

const timerValue = 1000;
const timeoutValue = 30000;
@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit, OnDestroy {
  user: User;
  resources: Resource[];
  appResources: Resource[];
  ispause = new Subject();
  timer: Observable<number>;
  timerObserver: PartialObserver<number>;
  selectedRegionName: string;
  connectTo: ActionResource;
  resourcesLoaded: boolean;
  isPerformingAction: boolean;
  rdp: Rdp;
  isConfiguringIrdp: boolean;
  dialogRef: any;
  cookieValue: string;
  hasIrdp: boolean;
  isApp: boolean;
  showSidePanel: boolean;
  hideHelpAndSupportButton: boolean;
  isDisabledHelpAndSupportButton: boolean;
  isDisabledResetPassword: boolean;
  resourceRegions: Region[];
  brandingConfigs = {
    title: environment.brandingConfig.appTitle,
    logoPath : environment.brandingConfig.appLogo !== '' ? environment.brandingConfig.appLogo : null
  };
  private time = 30;

  constructor(
    private authService: AuthService, private router: Router, private casRestService: CasRestService,
    private alertService: AlertService, private consoleService: ConsoleService, private dialog: MatDialog,
    private cookieService: CookieService, private helpSupportActionService: HelpSupportActionService) {
  }

  ngOnInit(): void {
    this.user = this.authService.user;
    this.resources = [];
    this.appResources = [];
    this.resourceRegions = [];
    this.selectedRegionName = '';
    this.resourcesLoaded = false;
    this.isPerformingAction = false;
    this.isApp = false;
    this.showSidePanel = false;
    this.hideHelpAndSupportButton = true;
    this.isDisabledHelpAndSupportButton = false;
    this.isDisabledResetPassword = this.user && this.user.importFrom && this.user.importFrom.toLowerCase() === ImportFrom.TrustedDomain;
    this.connectTo = new ActionResource({});
    this.getResources();
    this.timer = interval(timerValue)
      .pipe(
        takeUntil(this.ispause)
      );
    this.timerObserver = {
      next: (_: number) => {
        if (this.time === 0) {
          this.time = 30;
          this.getResources();
        }
        this.time -= 1;
      }
    };
    this.timer.subscribe(this.timerObserver);

    this.consoleService.isConfiguringIrdp.subscribe((isConfiguringIrdp: boolean) => {
      this.isConfiguringIrdp = isConfiguringIrdp;
      this.checkCookie();
    });
    this.checkCookie();

    this.helpSupportActionService.disabledHelpSupportButton.subscribe(disabled => this.isDisabledHelpAndSupportButton = disabled);
  }
  ngOnDestroy() {
    this.ispause.next();
    this.ispause.complete();
  }

  signOut() {
    this.authService.signOut();
    this.router.navigateByUrl('/signin');
  }
  showChangePasswordModal() {
    if (this.dialogRef) {
      return;
    }
    this.dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '350px',
      data: { user: this.user }
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
  }
  public toggleSidePanel(): void {
    this.showSidePanel = !this.showSidePanel;
  }

  getResources() {
    this.casRestService.getResources(this.user.username)
      .pipe(
        finalize(() => {
          this.resourcesLoaded = true;
        })
      )
      .subscribe((resources: { resources: Resource[] }) => {
        if (resources) {
          this.resources = _.filter(resources.resources, (resource) => resource.resourceType !== 'CloudApp');
          this.resources = this.resources ? this.resources : [];
          this.appResources = _.filter(resources.resources, (resource) => resource.resourceType === 'CloudApp');
          this.appResources = this.appResources ? this.appResources : [];
          this.getRegions();
        }
      }, () => {
        this.resources = [];
        this.appResources = [];
        this.resourceRegions = [];
      });
  }
  mapAction($event) {
    const resource = $event.resource as Resource;
    this.selectedRegionName = $event.region;
    if (resource.resourceRegions.length === 1 && resource.resourceRegions[0].status === 'CONNECTED_WAITING_FOR_USER'
      || (resource.resourceType === 'NPCP' || resource.resourceType === 'CloudApp')) {
      this.isApp = resource.resourceType === 'CloudApp';
      this.getRdpbyResource(resource);
    } else {
      this.postActionResource($event.action, $event.resource, $event.region);
    }
  }
  postActionResource(action, resource, region?) {
    this.connectTo = new ActionResource({
      username: this.user.username,
      resourceId: resource.resourceId,
      resourceType: resource.resourceType,
      region: region ? region : this.selectedRegionName,
      actionResource: action
    });
    this.casRestService.postActionResource(this.connectTo)
      .pipe(
        map((success: boolean) => {
          if (success) {
            this.isPerformingAction = false;
            if (action === 'powerOn') {
              this.consoleService.setPerformingAction(false);
              this.getRdpbyResource(resource);
            } else {
              this.alertService.success('Action performed succesfully');
              this.consoleService.setNotReadyAction(true);
              setTimeout(() => {
                this.time = 0;
              }, timeoutValue);
            }
          }
        }),
        catchError(err => {
          this.isPerformingAction = false;
          this.consoleService.setPerformingAction(false);
          this.alertService.error('Action failed');
          return err;
        })
      ).subscribe();
  }
  getRdpbyResource(resource: Resource) {
    this.casRestService.getRdpbyResource(this.user.username, resource.resourceType, resource.resourceId, this.selectedRegionName)
      .pipe(
        map((rdp) => {
          this.rdp = rdp;
          this.downloadRdp();
        }),
        catchError(err => {
          this.isPerformingAction = false;
          this.consoleService.setPerformingAction(false);
          this.alertService.error('Get rdp failed');
          return err;
        })
      ).subscribe();
  }
  downloadRdp() {
    if (this.rdp && this.rdp.rdpFileContents) {
      if (this.hasIrdp) {
        let data = atob(this.rdp.rdpFileContents.fileData);
        data = data + `\npassword:s:${this.user.password}`;
        this.rdp.rdpFileContents.fileData = btoa(data);
        window.open(`irdp://connection?${this.rdp.rdpFileContents.fileData}`);
      } else {
        const uri = `data:${this.rdp.rdpFileContents.mimeType};base64,${this.rdp.rdpFileContents.fileData}`;
        const downloadLink = document.createElement('a');
        downloadLink.href = uri;
        downloadLink.download = this.rdp.rdpFileContents.fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    } else {
      this.alertService.error(`Could not download RDP file`);
    }
    this.consoleService.setPerformingAction(false);
    this.rdp = null;
  }

  checkCookie() {
    this.cookieValue = this.cookieService.get('irdpInstalled');
    this.hasIrdp = this.cookieValue === 'true';
  }

  private getRegions(): void {
    this.resourceRegions = [];
    const resources = [this.resources, this.appResources];
    resources.forEach((resourceArray) => {
      _.each(resourceArray, (resource: Resource) => {
        const tempRegions = _.filter(resource.resourceRegions, (region: Region) => {
          return _.isEmpty(this.resourceRegions) ||
            _.any(this.resourceRegions, (otherRegion: Region) => otherRegion.regionName !== region.regionName);
        });
        this.resourceRegions = this.resourceRegions.concat(tempRegions);
      });
    });
    const arrayUniqueByKey = [...new Map(this.resourceRegions.map(item =>
      [item.regionName, item])).values()];
    this.resourceRegions = arrayUniqueByKey;
    this.hideHelpAndSupportButton = _.any(this.resourceRegions,
      (region: Region) => !region.latencyUrl || !region.bandwidthUrl ||
        !_.any(environment.urlExcludeFromInterceptor, url =>
          region.latencyUrl.toLowerCase().startsWith(url) &&
          region.bandwidthUrl.toLowerCase().startsWith(url))
    );
  }
}
