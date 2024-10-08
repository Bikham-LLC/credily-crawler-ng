import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { FailedConfigDTO } from 'src/app/models/FailedConfigDTO';
import { MappedConfiguraion } from 'src/app/models/MappedConfiguraion';
import { Route } from 'src/app/models/Route';
import { DataService } from 'src/app/services/data.service';
import { HeaderSubscriptionService } from 'src/app/services/header-subscription.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-noconfig-found-report',
  templateUrl: './noconfig-found-report.component.html',
  styleUrls: ['./noconfig-found-report.component.css']
})
export class NoconfigFoundReportComponent implements OnInit {


  dropdownSettingsVersion!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean, badgeShowLimit: number; };
  versionList: any[] = [{id:'V2', itemName:'V2'}, {id:'V3', itemName:'V3'}];
  selectedVersion: any[] = new Array();

  dropdownSettingsState!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean, badgeShowLimit: number; };
  stateList: any[] = new Array();
  selectedState: any[] = new Array();

  providerSearch = new Subject<string>();
  constructor(private reportService: ReportService,
    private dataService: DataService,
    private headerSubscriptionService : HeaderSubscriptionService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { 
      this.subscribeHeader = this.headerSubscriptionService.headerVisibilityChange.subscribe(async (value) => {
        debugger
        if(router.url == Route.NO_CONFIG_FOUND_REPORT){
          this.getNoConfigFoundReport();
        }
      })

      if (this.activatedRoute.snapshot.queryParamMap.has('version')) {
        this.routeVersion = this.activatedRoute.snapshot.queryParamMap.get('version');
      }

      this.providerSearch.pipe(
        debounceTime(600))
        .subscribe(value => {
          this.databaseHelper.currentPage = 1;
          this.getNoConfigFoundReport();
      });

      if(this.routeVersion != null){
        this.selectedVersion = [];
        this.versionFilterToggle = true;
        this.version = this.routeVersion;
        var temp : {id:any, itemName: any} = {id: this.routeVersion, itemName : this.routeVersion};
        this.selectedVersion.push(temp);
      }
    }

  routeVersion:any;
  subscribeHeader:any;
  ngOnInit(): void {
    this.dropdownSettingsVersion = {
      singleSelection: true,
      text: 'Select Version',
      enableSearchFilter: false,
      autoPosition: false,
      badgeShowLimit: 1
    };

    this.dropdownSettingsState = {
      singleSelection: false,
      text: 'Select State',
      enableSearchFilter: true,
      autoPosition: false,
      badgeShowLimit: 1,
    };

    this.getNoConfigFoundReport();
    this.getStates();
  }

  versionFilterToggle:boolean = false;
  filterByVersion(){
    this.versionFilterToggle = !this.versionFilterToggle;
  }

  selectVersion(event:any){
    debugger
    this.version = '';
    this.selectedVersion = [];
    if(event != undefined && event.length > 0){
      this.version = event[0].id;
      var temp : {id:any, itemName: any} = {id: event[0].id, itemName : event[0].id};
      this.selectedVersion.push(temp);
    }
    this.getNoConfigFoundReport();
    this.versionFilterToggle = false
  }


  version : string='';
  databaseHelper: DatabaseHelper = new DatabaseHelper();
  noConfigFoundList: FailedConfigDTO[] = [];
  totalItems:number = 0;
  noConfigLoadingToggle:boolean = false;
  getNoConfigFoundReport(){
    this.noConfigLoadingToggle = true;
    this.reportService.getNoConfigFoundReport(this.dataService.startDate, this.dataService.endDate, this.databaseHelper, this.version, this.states).subscribe(response=>{
      if(response != null){
        this.noConfigFoundList = response.list;
        this.totalItems = response.totalItems;
      }
      this.noConfigLoadingToggle = false;
    },error=>{
      this.noConfigLoadingToggle = false;
    })
  }

  pageChanged(event:any){
    this.databaseHelper.currentPage = event;
    this.getNoConfigFoundReport();
  }

  @ViewChild('viewConfigModalButton') viewConfigModalButton!: ElementRef
  @ViewChild('closeConfigModalButton') closeConfigModalButton!: ElementRef
  mappedConfiguraionList : MappedConfiguraion[] = new Array();
  mappedConfigLoadingToggle:boolean = false;
  logId:number=0;
  getMappedConfiguration(logId:number){
    debugger
    this.logId = 0;
    this.logId = logId;
    this.mappedConfigLoadingToggle =true;
    this.viewConfigModalButton.nativeElement.click();
    this.reportService.getMappedConfiguration(logId).subscribe(response=>{
      if(response != null){
        this.mappedConfiguraionList = response;
      }
      this.mappedConfigLoadingToggle = false;
    },error=>{
      this.mappedConfigLoadingToggle = false;
    })
  }


  runConfigLoadingToggle:boolean = false;
  runMappedConfiguration(configId:number, index:number){
    debugger
    this.runConfigLoadingToggle = true;
    this.mappedConfiguraionList[index].runConfigLoadingToggle = true;
    this.reportService.runMappedConfiguration(configId, this.logId).subscribe(response=>{
      this.mappedConfiguraionList[index].runConfigLoadingToggle = false;
      this.runConfigLoadingToggle = false;
      setTimeout(() => {
        this.closeConfigModalButton.nativeElement.click();
        this.dataService.showToast(response.message);
      }, 300);
      this.getNoConfigFoundReport();
    },error=>{
      this.runConfigLoadingToggle = false;
      this.mappedConfiguraionList[index].runConfigLoadingToggle = false;
    })
  }


  getStates(){
    this.reportService.getReportState('noConfigFound').subscribe(response=>{
      if(response != null){
        this.stateList = response;
      }
    },error=>{

    })
  }

  stateFilterToggle:boolean = false;
  filterByState(){
    this.stateFilterToggle = !this.stateFilterToggle;
  }

  states:string[] = []
  selectState(event:any){
    debugger
    this.states = [];
    if(event != undefined && event.length > 0){
      event.forEach((element:any) => {
        this.states.push(element.itemName);
      });
    }
    this.getNoConfigFoundReport();
    this.stateFilterToggle = false;
  }

}
