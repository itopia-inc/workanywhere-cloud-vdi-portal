import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {forkJoin} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import * as moment from 'moment';
import { SpeedTestService } from 'ng-speed-test';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatChipInputEvent, MatChipList} from '@angular/material/chips';
import * as _ from 'underscore';

import {Region, RegionInfoMail, User} from '../_models';
import {HelpSupportService} from './service/help-support.service';
import { HelpSupportActionService } from './service/help-support-action.service';
import { AlertService } from '../_services/alert.service';

const latencyRequestCount = 5;
const bandwidthRequestCount = 5;
const retryDelayTime = 500;
const fileSize = 4952221;
const latencyThresholds = {
  min: 150,
  medium: 200
};
const bandwidthThresholds = {
  high: 8,
  medium: 2
};
const fixedCount = 2;
const two = 2;
@Component({
    selector: 'app-help-support',
    templateUrl: 'help-support.component.html',
    styleUrls: ['help-support.component.scss']
})
export class HelpSupportComponent implements OnInit, OnChanges{
    @Input()
    public isDisabledFromOutside: boolean;

    @Input()
    public resourceRegions: Region[];

    @Input()
    public user: User;

    public isTestButtonDisabled: boolean;
    public isTestFinished: boolean;
    public isTestFailed: boolean;
    public testButtonText: string;
    public localRegions: Region[];

    public mails: string[];
    public separatorKeysCodes: number[] = [ENTER, COMMA];
    public mailForm: FormGroup;
    public validationType!: {mails: any[]};
    public sendingMail: boolean;
    public isDataReadyForMail: boolean;

    @ViewChild('chipList') chipList!: MatChipList;

    constructor(private helpSupportService: HelpSupportService, private helpSupportActionService: HelpSupportActionService,
                private speedTestService: SpeedTestService, private alertService: AlertService, private formBuilder: FormBuilder){}

    public ngOnInit(): void {
        this.isTestButtonDisabled = this.isDataReadyForMail = false;
        this.isTestFinished = false;
        this.isTestFailed = false;
        this.testButtonText = 'Start test';
        this.localRegions = [];
        if (!this.resourceRegions) {
          this.resourceRegions = [];
        }
        this.mails = [];
        this.mailForm = this.formBuilder.group({
          mails: this.formBuilder.array(this.mails, Validators.email)
        });
        this.validationType = {
          mails: [ Validators.email],
        };
        this.sendingMail = false;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.isDisabledFromOutside && !changes.isDisabledFromOutside.firstChange) {
            this.isDisabledFromOutside = changes.isDisabledFromOutside.currentValue;
        }
    }

    get mailsControls(): FormArray {
      return this.mailForm.controls.mails as FormArray;
    }

    public startTest(): void {
      this.testButtonText = 'Testing...';
      this.isTestButtonDisabled = true;
      this.isTestFinished = false;
      this.isTestFailed = false;

      this.helpSupportActionService.setDisabledHelpSupportButton(true);

      this.localRegions = [];
      _.each(this.resourceRegions, (region: Region) => this.localRegions.push(region));
      _.each(this.localRegions, (region: Region) => {
        region.loadingLatency = true;
        region.loadingBandwidth = true;
        this.getRegionLatencyAndBandwidth(region);
      });

    }

    private getRegionLatencyAndBandwidth(region: Region): void {
        this.helpSupportService.getRegionLatency(region.latencyUrl)
            .pipe(
                map(() => {
                  this.getRegionLatency(region);
                  this.getRegionBandwidth(region);
                }),
                catchError((error)  => {
                    this.finishTest(true, error);
                    return error;
                })
            )
            .subscribe();
    }

    private getRegionLatency(region: Region, latencyStartTimes: any[] = [], latencyEndTimes: any[]  = []): void {
      if (!this.isTestFinished) {
        const startTime = moment();
        latencyStartTimes.push(startTime);
        this.helpSupportService.getRegionLatency(region.latencyUrl)
            .pipe(
                map(() => {
                    const endTime = moment();
                    latencyEndTimes.push(endTime);
                    if (latencyEndTimes.length === latencyRequestCount) {
                      region.loadingLatency = false;
                      this.latencyTestCallback(region, latencyStartTimes, latencyEndTimes);
                    } else {
                      this.getRegionLatency(region, latencyStartTimes, latencyEndTimes);
                    }
                }),
                catchError((error)  => {
                    region.loadingLatency = false;
                    this.finishTest(true, error);
                    return error;
                })
            ).subscribe();
      }
    }

    private getRegionBandwidth(region: Region): void {
      this.speedTestService.getMbps(
                    {
                      iterations: bandwidthRequestCount,
                      retryDelay: retryDelayTime,
                      file: {
                        size: fileSize,
                        shouldBustCache: true,
                        path: region.bandwidthUrl
                      }
                    }
                  )
                  .pipe(
                    map((speedInMpbs) => {
                      region.loadingBandwidth = false;
                      this.bandwidthTestCallback(region, speedInMpbs);
                    }),
                    catchError((error)  => {
                        region.loadingBandwidth = false;
                        this.finishTest(true, error);
                        return error;
                    })
                  ).subscribe();
    }

    private finishTest(failed: boolean, error?: string): void {
      this.isTestFailed = failed;
      this.testButtonText = 'Test again';
      this.isTestButtonDisabled = false;
      this.isTestFinished = true;
      this.helpSupportActionService.setDisabledHelpSupportButton(false);
      if (failed) {
        this.alertService.error(error);
      }
      this.isDataReadyForMail = failed;
    }

    private latencyTestCallback(region: Region, latencyStartTimes: any[], latencyEndTimes: any[]): void {
      const latencyResponseTimes = [];
      _.each(latencyEndTimes, (value, index) => {
        const elapsedTime = value.diff(latencyStartTimes[index], 'milliseconds');
        latencyResponseTimes.push(elapsedTime);
      });
      if (!this.isTestFinished) {
        const sortedTimes = _.sortBy(latencyResponseTimes, (response) => response);
        const size = sortedTimes.length;
        region.latencyMedian = size === 0
                                ? 0
                                : size % two === 0
                                  ? (sortedTimes[(size / two) - 1] +
                                      sortedTimes[((size + two) / two) - 1]
                                    ) / two
                                  : sortedTimes[((size + 1 ) / two) - 1];

        region.latencyClass = (region.latencyMedian < latencyThresholds.min)
            ? 'text-success'
            : (region.latencyMedian >= latencyThresholds.min && region.latencyMedian <= latencyThresholds.medium)
                ? 'golden-warning-text'
                : 'text-danger';

        if (_.all(this.localRegions, (r: Region) => r.latencyMedian && r.bandwidthAverage)) {
            this.finishTest(false);
        }
      }
    }

    private bandwidthTestCallback(region: Region, bandwidthAverage: number): void {
      if (!this.isTestFinished) {
        region.bandwidthAverage = Number(bandwidthAverage.toFixed(fixedCount));

        region.bandwidthClass = (region.bandwidthAverage > bandwidthThresholds.high)
            ? 'text-success'
            : (region.bandwidthAverage >= bandwidthThresholds.medium && region.bandwidthAverage <= bandwidthThresholds.high)
                ? 'golden-warning-text'
                : 'text-danger';

        if (_.all(this.localRegions, (r: Region) => r.latencyMedian && r.bandwidthAverage)) {
            this.finishTest(false);
        }
      }
    }

    public add(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;
      if ((value || '').trim()) {
          this.mailsControls.push(this.formBuilder.control(value));
          const isInvalid = this.validateEmail() || this.repeatedEmail(value);
          if (isInvalid) {
            if (this.chipList) {
              this.chipList.errorState = true;
            }
           } else {
              this.chipList.errorState = false;
           }
      }
      if (input && !this.validateEmail() && !this.repeatedEmail(value))
      {
        input.value = '';
      }
      else {
        this.chipList.errorState = true;
        this.mailsControls.removeAt(this.mailsControls.length - 1);
      }
    }

    public remove(mail: string): void {
      const index = this.mailsControls.value.indexOf(mail);
      if (index >= 0) {
        this.mailsControls.removeAt(index);
      }
      if (this.mailsControls.length === 0){
        this.chipList.errorState = false;
      }
      this.setEmails();
      const hasRepeated = _.uniq(this.mailsControls.value).length !== this.mailsControls.value.length;
      if (!hasRepeated){
        this.chipList.errorState = false;
      }
    }

    public sendMail(): void {
      this.sendingMail = true;
      const regions = _.map(this.localRegions, (region: Region) => {
        return {region: region.regionName, latency: region.latencyMedian.toString(), bandwidth: region.bandwidthAverage.toString()};
      });
      const regionInfo: RegionInfoMail = {
          myRdpRegions: regions,
          emails: this.mailsControls.value
        };
      this.helpSupportService.sendEmail(regionInfo, this.user.username).subscribe((data: {count: number, list: string[]}) => {
        this.sendingMail = false;
        if (data.count > 0) {
          const notSend = data.list.join(',');
          this.alertService.warn(`Can not send emails to: '${notSend}`);
          this.mails = [];
        } else {
          this.alertService.success('Network test result email sent');
          this.mails = [];
        }
        }, (error: Error) => {
        this.alertService.error('Can not send emails');
        this.sendingMail = false;
        });
       }

    public setEmailValue($event: any): void {
      const value = $event?.target?.value?.toLowerCase().trim();
      if (value === '' || !value) {
        this.chipList.errorState = false;
      }
      if (this.mailsControls.length === 0) {
        this.chipList.errorState = false;
      }
      this.setEmails();
    }

    private validateEmail(): boolean {
    let invalid = false;
    _.map(this.mailsControls.controls, (control) => {
      control.setValidators(this.validationType.mails);
      control.markAsTouched();
      control.updateValueAndValidity();
      if (control.invalid){
        invalid = true;
        return;
      }
    });
    return invalid;
  }

    private repeatedEmail(email: string): boolean {
      const value = _.contains(this.mails,  email);
      return value;
    }

    private setEmails(): void {
      this.mails = _.pluck(this.mailsControls.controls, 'value');
    }
}
