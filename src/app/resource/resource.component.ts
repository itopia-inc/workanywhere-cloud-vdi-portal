import { Subscription } from 'rxjs';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'underscore';

import { ResourceStatus } from '../_enums';
import { Region } from '../_models/region';
import { Resource } from './../_models/resource';
import { ConsoleService } from '../console/console.service';
import { CapitalizePipe } from '../_pipes';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {
  @Input()
  resource: Resource;
  @Input()
  isApp: boolean;

  @Output()
  downloadRdp = new EventEmitter();
  @Output()
  performAction = new EventEmitter<{}>();

  selectedRegionName: string;
  statusGroups: any[];
  actionSelected: string;
  isPerformingAction: boolean;
  permormingActionSubs: Subscription;
  notReadySubs: Subscription;
  notReady: boolean;
  isUnavailable: boolean;

  constructor(private consoleService: ConsoleService, private capitalizePipe: CapitalizePipe) { }

  ngOnInit(): void {
    this.actionSelected = 'Connect';
    this.statusGroups =  this.mapRegions(this.resource);
    this.permormingActionSubs = this.consoleService.performingAction.subscribe((isPerformingAction: boolean) => {
      this.isPerformingAction = isPerformingAction;
      if (!this.isPerformingAction && this.actionSelected.toLowerCase() !== ResourceStatus.UNAVAILABLE
      && this.actionSelected.toLowerCase() !== ResourceStatus.MAINTENANCE_MODE) {
        this.actionSelected = 'Connect';
      }
    });
    this.notReadySubs = this.consoleService.notReadyAction.subscribe((notReady: boolean) => {
      this.notReady = notReady;
      if (this.notReady) {
        this.actionSelected  =  'Preparing instance...';
      } else {
        if (this.actionSelected.toLowerCase() !== ResourceStatus.UNAVAILABLE
        && this.actionSelected.toLowerCase() !== ResourceStatus.MAINTENANCE_MODE) {
          this.actionSelected = 'Connect';
        }
      }
      this.isPerformingAction = this.notReady;
    });
    this.setStatus();
  }
  setStatus() {
    if (this.resource.resourceRegions.length === 1){
      this.notReady = this.resource.resourceRegions[0].status.toLowerCase() === ResourceStatus.CONNECTION_IN_PROCESS;
      if (this.notReady) {
        this.actionSelected  =  'Preparing instance';
      } else {
        this.actionSelected = 'Connect';
      }

      switch (this.resource.resourceRegions[0].status.toLowerCase()) {
        case ResourceStatus.PENDING:
        case ResourceStatus.UNAVAILABLE:
          this.isUnavailable = true;
          this.actionSelected = this.capitalizePipe.transform(ResourceStatus.UNAVAILABLE);
          break;
        case ResourceStatus.MAINTENANCE_MODE:
          this.isUnavailable = true;
          this.actionSelected = this.capitalizePipe.transform(ResourceStatus.MAINTENANCE_MODE);
          break;
        default:
          this.isUnavailable = false;
          break;
      }

      this.isPerformingAction = this.notReady;
    }
  }
  mapRegions(resource) {
    const tempGroup = [];
    this.actionSelected = this.capitalizePipe.transform(ResourceStatus.UNAVAILABLE);
    this.isUnavailable = true;
    resource.resourceRegions.forEach((region: Region) => {
      let disable = false;
      if (region.status) {
        switch (region.status.toLowerCase()) {
          case ResourceStatus.PENDING:
          case ResourceStatus.UNAVAILABLE:
          case ResourceStatus.MAINTENANCE_MODE:
            disable = true;
            break;
          default:
            this.actionSelected = 'Connect';
            this.isUnavailable = false;
            break;
        }
      }
      if (region.preferred && !disable) {
        tempGroup.push({ name: 'Recommended', disabled: disable, region: [region] });
      } else {
        const status = _.findWhere(tempGroup, { name: region.status });
        if (!status) {
          tempGroup.push({ name: region.status, disabled: disable, region: [region] });
        } else {
          status.region.push(region);
        }
      }
    });
    return tempGroup;
  }
  setDedicatedAction(action, resource: Resource, region?: string) {
    if (this.isPerformingAction ||  this.isUnavailable) {
      return;
    }
    this.selectedRegionName = resource.resourceRegions[0].regionName;
    region = region ? region : this.selectedRegionName;
    this.isPerformingAction = true;
    switch (action) {
      case 'powerOn':
        this.actionSelected = 'Connecting...';
        break;
      case 'reboot':
        this.actionSelected = 'Rebooting...';
        break;
      case 'powerOff':
        this.actionSelected = 'Powering Off...';
        break;
    }
    this.performAction.emit({action, resource, region});
  }
  connectToRegion($event) {
    this.selectedRegionName = $event.value ? $event.value : $event;
    if (typeof this.selectedRegionName === 'string') {
      this.sendConnectData();
    }
  }
  connectToPreferedRegion() {
    if (!this.isUnavailable) {
      let preferredRegion = this.resource.resourceRegions.find(region => region.preferred
        && region.status.toLowerCase() === ResourceStatus.AVAILABLE);
      if (!preferredRegion) {
        preferredRegion = this.resource.resourceRegions.find(region => region.status.toLowerCase() === ResourceStatus.AVAILABLE);
      }
      if (preferredRegion) {
        this.selectedRegionName = preferredRegion.regionName;
        this.sendConnectData();
      }
    }
  }

  private sendConnectData() {
    const data = {action: 'powerOn', resource: this.resource, region: this.selectedRegionName};
    this.actionSelected = 'Connecting...';
    this.isPerformingAction = true;
    this.downloadRdp.emit(data);
  }
}
