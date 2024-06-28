import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CommentRequest } from 'src/app/models/CommentRequest';
import { Constant } from 'src/app/models/Constant';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { FailedConfigDTO } from 'src/app/models/FailedConfigDTO';
import { ProviderRequestCrawlerLog } from 'src/app/models/ProviderRequestCrawlerLog';
import { Route } from 'src/app/models/Route';
import { DataService } from 'src/app/services/data.service';
import { HeaderSubscriptionService } from 'src/app/services/header-subscription.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-failed-config-report',
  templateUrl: './failed-config-report.component.html',
  styleUrls: ['./failed-config-report.component.css']
})
export class FailedConfigReportComponent implements OnInit {

  readonly Route = Route;
  readonly Constant = Constant;



  dropdownSettingsVersion!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean, badgeShowLimit: number; };
  versionList: any[] = [{id:'V2', itemName:'V2'}, {id:'V3', itemName:'V3'}];
  selectedVersion: any[] = new Array();

  dropdownSettingsState!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean, badgeShowLimit: number; };
  stateList: any[] = new Array();
  selectedState: any[] = new Array();

  providerSearch = new Subject<string>();
  constructor(private reportService : ReportService,
    private router : Router,
    private dataService: DataService,
    private activatedRoute: ActivatedRoute,
    private headerSubscriptionService: HeaderSubscriptionService) { 
    
      if (this.activatedRoute.snapshot.queryParamMap.has('version')) {
        this.routeVersion = this.activatedRoute.snapshot.queryParamMap.get('version');
      }

      // if(this.activatedRoute.snapshot.queryParamMap.has('d1') && this.activatedRoute.snapshot.queryParamMap.has('d2')) {
      //   this.dataService.startDate = this.activatedRoute.snapshot.queryParamMap.get('d1');
      //   this.dataService.endDate = this.activatedRoute.snapshot.queryParamMap.get('d2')
      //   this.dataService.selected = {startDate:moment(this.dataService.startDate), endDate:moment(this.dataService.endDate)};
      //   this.dashboardDateFilterToggle = true;
      // }
      
      this.providerSearch.pipe(
      debounceTime(600))
      .subscribe(value => {
        this.databaseHelper.currentPage = 1;
        this.getFailedConfigs(this.configType, 0);
      });

      this.subscribeHeader = this.headerSubscriptionService.headerVisibilityChange.subscribe(async (value) => {
        debugger

        if(router.url == Route.FAILED_CONFIG_REPORT){
          this.getFailedConfigs(this.configType, 0);
          this.getFailedConfigsCount();
        }

        if(this.routeVersion != null){
          this.selectedVersion = [];
          this.versionFilterToggle = true;
          this.version = this.routeVersion;
          var temp : {id:any, itemName: any} = {id: this.routeVersion, itemName : this.routeVersion};
          this.selectedVersion.push(temp);
        }
      })
    }

  subscribeHeader : any;
  dashboardDateFilterToggle:boolean = false;
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
      badgeShowLimit: 1
    };

    this.getFailedConfigs(this.configType, 0);
    this.getFailedConfigsCount();
    this.getStates();
  }

  versionFilterToggle:boolean = false;
  filterByVersion(){
    this.versionFilterToggle = !this.versionFilterToggle;
  }
  routeVersion:any;
  version:string=''
  selectVersion(event:any){
    debugger
    this.selectedVersion = [];
    this.version = '';
    if(event != undefined && event.length > 0){
      this.version = event[0].id;
    }
    this.getFailedConfigs(this.configType, 1);
    this.getFailedConfigsCount();
    this.versionFilterToggle = false
  }

  configType:string ='';
  configLoadingToggle:boolean = false;
  databaseHelper: DatabaseHelper = new DatabaseHelper();
  failedConfigList : FailedConfigDTO[] = new Array();
  totalConfigsCount:number=0;
  getFailedConfigs(configType:string, isPageChanged:number){
    this.configLoadingToggle = true;
    if(this.configType == configType && isPageChanged != 1){
      this.configType = '';
    } else {
      this.configType = configType;
    }
    this.reportService.getFailedConfigs(this.dataService.startDate, this.dataService.endDate, this.databaseHelper, this.configType, this.version, this.states).subscribe(response=>{
      if(response != null){
        this.failedConfigList = response.list;
        this.totalConfigsCount = response.totalItems;
      }
      this.configLoadingToggle = false;
    },error=>{
      this.configLoadingToggle = false;
    })
  }

  reRunSucessful:number =0;
  reRunFailed:number =0;
  reRunPending:number =0;
  getFailedConfigsCount(){
    this.reportService.getFailedConfigsCount(this.dataService.startDate, this.dataService.endDate, this.version).subscribe(response=>{
      if(response != null){
        this.reRunSucessful = response.reRunSucessful;
        this.reRunFailed = response.reRunFailed;
        this.reRunPending = response.reRunPending;
      }
    },error=>{

    })
  }

  pageChanged(event:any){
    this.databaseHelper.currentPage = event;
    this.getFailedConfigs(this.configType, 1);
  }

  routeToConfiguration(lookupName: string, lookupLink:string){
    this.reportService.getConfigId(lookupName, lookupLink).subscribe(response=>{
      if(response != null){
        let navigateExtra : NavigationExtras = {
          queryParams : {"id" : response},
        };
        this.router.navigate([this.Route.HOME_CONFIGURATION_ROUTE], navigateExtra)
      }
    },error=>{

    })
  }


  @ViewChild('closeSnapshotModalButton') closeSnapshotModalButton !: ElementRef;
  closeSnapshotModal(){
    this.closeSnapshotModalButton.nativeElement.click();
  }

  @ViewChild('openSnapshotModalButton') openSnapshotModalButton !: ElementRef;
  imageUrl:string='';
  imageLoadingToggle:boolean = false;
  viewSnapshot(url:string){
    debugger
    this.imageLoadingToggle = true;
    this.imageUrl = url;
    this.openSnapshotModalButton.nativeElement.click();
    setTimeout(()=>{
      this.imageLoadingToggle = false;
    },1000)
  }

  @ViewChild('completeModalButton') completeModalButton !: ElementRef;
  comment:string='';
  openCommentModal(obj:FailedConfigDTO){
    this.comment = '';
    this.commentRequest.configLink = obj.configLink;
    this.commentRequest.configName = obj.configName;
    this.commentRequest.logId = obj.id;
    this.completeModalButton.nativeElement.click();
  }
  
  @ViewChild('closeCommentModalButton') closeCommentModalButton !: ElementRef;
  closeCommentModal(){
    this.closeCommentModalButton.nativeElement.click();
  }

  commentRequest:CommentRequest = new CommentRequest();
  commentSavingToggle:boolean = false;
  currentTime: any = moment().format('Do MMM YYYY, h:mm a');
  createConfigComment(){
    debugger
    this.commentSavingToggle = true;
    this.commentRequest.comment = this.comment;
    this.reportService.createConfigComment(this.commentRequest).subscribe(response=>{
      if(response){
        this.closeCommentModal();
      }
      this.commentSavingToggle = false;
    },error=>{
      this.commentSavingToggle = false;
    })
  }


  logRerunToggle:boolean = false;
  reRunProviderLog(logId:number, index:number){
    this.logRerunToggle = true;
    this.failedConfigList[index].reTestingToggle = true;
    this.reportService.reRunProviderLog(logId).subscribe(response=>{
      if(response){
        this.getFailedConfigs(this.configType, 0); 
      }
      this.logRerunToggle = false;
      this.failedConfigList[index].reTestingToggle = false;
    },error=>{
      this.failedConfigList[index].reTestingToggle = false;
      this.logRerunToggle = false;
    })
  }

  getStates(){
    this.reportService.getReportState('failedReport').subscribe(response=>{
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
    this.getFailedConfigs(this.configType, 1);
    this.getFailedConfigsCount();
    this.stateFilterToggle = false;
  }

}
