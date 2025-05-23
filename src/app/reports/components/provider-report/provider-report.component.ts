import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, filter, finalize } from 'rxjs/operators';
import { Constant } from 'src/app/models/Constant';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { ProviderReport } from 'src/app/models/ProviderReport';
import { ProviderRequestCrawlerLog } from 'src/app/models/ProviderRequestCrawlerLog';
import { Route } from 'src/app/models/Route';
import { DataService } from 'src/app/services/data.service';
import { ReportService } from 'src/app/services/report.service';
import * as _ from 'lodash'; 
import { ImageUpload } from 'src/app/models/ImageUpload';
import * as moment from 'moment';
import { SnapshotRequest } from 'src/app/models/SnapshotRequest';
import { AngularFireStorage } from '@angular/fire/storage';
import { HeaderSubscriptionService } from 'src/app/services/header-subscription.service';
import { LicenseLookupService } from 'src/app/services/license-lookup.service';
import { LogConfigRequest } from 'src/app/models/LogConfigRequest';
import { LicenseTypeJson } from 'src/app/models/LicenseTypeJson';

@Component({
  selector: 'app-provider-report',
  templateUrl: './provider-report.component.html',
  styleUrls: ['./provider-report.component.css']
})
export class ProviderReportComponent implements OnInit {

  readonly Route = Route;
  readonly Constant = Constant;

  today: any = new Date(moment().toDate()).toDateString();
  yesterday: any = new Date(moment().toDate()).toDateString();
 
  dropdownSettingsVersion!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean, badgeShowLimit: number; };
  dropdownSettingsStatus!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean, badgeShowLimit: number; };
  versionList: any[] = [{id:'V2', itemName:'Credily'}, {id:'V3', itemName:'Provider Passport'}];
  statusList: any;
  selectedVersion: any[] = new Array();
  selectedStatus: any[] = new Array();

  requestSource: string = '';
  providerSearch = new Subject<string>();
  matchConfig = new Subject<string>();

  constructor( private reportService:ReportService,
    private router : Router,
    private dataService: DataService,
    private firebaseStorage: AngularFireStorage,
    private headerSubscriptionService: HeaderSubscriptionService,
    private licenseLookupService: LicenseLookupService
    ) { 

    this.providerSearch.pipe(
      debounceTime(600))
      .subscribe(value => {
        this.databaseHelper.currentPage = 1;
        this.getProviderReport(this.filterType, 0);
      });

    this.matchConfig.pipe(
      debounceTime(600))
      .subscribe(value => {
        this.matchConfigName();
      });

      this.subscribeHeader = this.headerSubscriptionService.headerVisibilityChange.subscribe(async (value) => {
        debugger
        if(router.url == Route.PROVIDER_REPORT){
          this.getProviderReport(this.filterType, 0);
          this.getProviderReportCount();
        }
        console.log('In constructor - '+ this.subscribeHeader?.destination?.closed)
      })
  }

  subscribeHeader :any;
  
  ngOnInit(): void {
    debugger
    this.dropdownSettingsVersion = {
      singleSelection: true,
      text: 'Select Version',
      enableSearchFilter: false,
      autoPosition: false,
      badgeShowLimit: 1
    };

    // this.dropdownSettingsSource = {
    //   singleSelection: true,
    //   text: 'Select Source',
    //   enableSearchFilter: false,
    //   autoPosition: false,
    //   badgeShowLimit: 1
    // };

    this.dropdownSettingsStatus = {
      singleSelection: true,
      text: 'Select Status',
      enableSearchFilter: false,
      autoPosition: false,
      badgeShowLimit: 1
    };

    this.dropdownSettingsAttachmentType = {
      singleSelection: true,
      text: 'Select Attachment Type',
      enableSearchFilter: true,
      autoPosition: false
    }

    this.dropdownSettingsAttachmentSubType = {
      singleSelection: true,
      text: 'Select Attachment Sub Type',
      enableSearchFilter: true,
      autoPosition: false
    }

    this.dropdownSettingsConfigName = {
      singleSelection: true,
      text: 'Select configuration',
      enableSearchFilter: true,
      autoPosition: false,
      searchPlaceholderText: 'Search By Name'
    }

    this.dropdownSettingsLicenseType = {
      singleSelection: true,
      text: 'Select License Type',
      enableSearchFilter: true,
      autoPosition: false,
      lazyLoading: true
    };

    this.getProviderReport(this.filterType, 0);
    this.getProviderReportCount();
    this.getNewProviderReportCount();
    // console.log('In ngOnInit - '+ this.subscribeHeader.destination.closed)

    this.tempConfigIds = []

  }

  ngOnDestroy(){
    this.subscribeHeader.unsubscribe();
  }

  databaseHelper:DatabaseHelper = new DatabaseHelper();
  providerList:ProviderReport[] = new Array();
  totalProviders:number=0;
  fetchingReport:boolean=false;
  status:string='';

  completedCount:number =0;
  partiallyCompletedCount:number =0;
  logRequiredCount:number =0;
  getProviderReportCount(){
    this.reportService.getProviderReportCount(this.dataService.startDate, this.dataService.endDate, this.version, this.providerType, this.dataService.isLiveAccount, this.requestSource).subscribe(response=>{
      if(response != null){
        this.completedCount = response.completedCount;
        this.partiallyCompletedCount = response.partiallyCompletedCount;
        this.logRequiredCount = response.logRequiredCount;

        setTimeout(() =>{
          this.statusList = [ 
            {id:'completed', itemName: `Completed - ${this.completedCount}`}, 
            {id:'partiallyCompleted', itemName:`Partially Completed - ${this.partiallyCompletedCount}`}, 
            {id:'logRequired', itemName:`Log Required - ${this.logRequiredCount}`}];
        }, 200)

      }
    },error=>{

    })
  }

  providerType:string = 'licensed';
  switchProviderType( requestSource: string){
    // this.providerType = type;
    this.requestSource = requestSource
    this.getProviderReport(this.filterType, 0);
    this.getProviderReportCount();
  }

  getProviderReport(filterType:string, isPageChange:number){
      debugger
      this.fetchingReport = true;
      this.databaseHelper.currentPage = this.p;
      if (!this.pageToggle) {
        this.p = 1;
        this.databaseHelper.currentPage = this.p;
      }

      this.providerList = [];
    this.reportService.getProviderReport(this.databaseHelper, this.filterType, this.dataService.startDate, this.dataService.endDate, this.version, 'licensed', this.dataService.isLiveAccount, this.requestSource).subscribe(response => {
      if(response!=null){
        this.pageToggle = false;
        this.providerList = response.object;
        this.totalProviders = response.totalItems;
      }
      this.fetchingReport = false;
    }, error => {
      this.fetchingReport = false;
    })
  }

  newSchedulerCount:number = 0;
  newOnboardingCount:number = 0;
  newUpdatedCount:number = 0;
  schedulerToggle: boolean = false
  onboardingToggle: boolean = false
  updatedToggle: boolean = false
  getNewProviderReportCount(){
    this.reportService.getNewProviderReportCount(this.yesterday, this.today,'licensed',1).subscribe(response => {
      if(response != null){
        this.newOnboardingCount = response.object.newOnboardingCount;
        this.newSchedulerCount = response.object.newSchedulerCount;
        this.newUpdatedCount = response.object.newUpdatedCount;
        if(this.newOnboardingCount>0) this.onboardingToggle = true
        if(this.newSchedulerCount>0) this.schedulerToggle = true
        if(this.newUpdatedCount>0) this.updatedToggle = true
      }
    })
  }

  filterType:string= '';
  versionFilterToggle:boolean = false;
  filterByVersion(){
    this.versionFilterToggle = !this.versionFilterToggle;
  }

  version:string='';
  selectVersion(event:any){
    debugger
    this.version = '';
    if(event != undefined && event.length > 0){
      this.version = event[0].id;
    }
    this.getProviderReport(this.filterType, 1);
    this.getProviderReportCount();
    this.versionFilterToggle = false
  }

  selectStatus(event:any){
    debugger
    this.filterType = '';
    this.databaseHelper.currentPage = 1;
    if(event != undefined && event.length > 0){
      this.filterType = event[0].id;
    }
    this.getProviderReport("", 1);
    this.getProviderReportCount();
  }
  

  p: number = 1;
  pageToggle: boolean = false;
  pageChanged(event:any){
    debugger
    // this.databaseHelper.currentPage = event;
    this.pageToggle = true;
    this.p = event;
    this.getProviderReport(this.filterType, 1);
  }

  logType:string='crawlerLog';
  isRpaConfig:number=0;
  isArchive:number=0;
  isOcrConfig:number=0;
  isConfigNotFound:number=0
  switchLogTab(tab:string){
    this.logType = tab;
    this.isArchive = 0;
    this.isOcrConfig = 0;
    if(tab == 'replicateLog'){
      this.uuidList = [];
      this.isAllSelected = false;
      this.openConfigReplicateModal();
    } else {
      this.isRpaConfig = 0;
      this.isConfigNotFound = 0;

      if(tab == 'archiveLog') {
        this.isArchive = 1;
      }
      if(tab == 'configNotFound') {
        this.isConfigNotFound = 1;
      }
      if(tab == 'rpaLog') {
        this.isRpaConfig = 1;
      }
      if(tab == 'ocrLog') {
        this.isOcrConfig = 1;
        this.getOcrProviderAttachment();
      }else{
        this.getProviderLogs(this.uuid);
      }
    }
  }

  clear(){
    this.isArchive = 0;
    this.isOcrConfig = 0;
    this.isRpaConfig = 0;
    this.isConfigNotFound = 0;
  }

  credilyProviderList : {uuid:any, providerName:string, accountName:string, checked: boolean}[] = []
  credilyProviderLoading: boolean = false;
  getCredilyProvider() {
    this.credilyProviderLoading = true;
    this.reportService.getCredilyProvider(this.providerNpi).subscribe(response=>{
      if(response != null){
        this.credilyProviderList = response;
      }
      this.credilyProviderLoading = false;
    },error =>{
      this.credilyProviderLoading = false;
    })
  }

  openConfigReplicateModal(){
    this.configReplicateModalButton.nativeElement.click();
    this.getCredilyProvider();
  }

  @ViewChild('configReplicateModalButton') configReplicateModalButton!: ElementRef;
  @ViewChild('closeReplicateModalButton') closeReplicateModalButton!:ElementRef
  closeReplicateModal(){
    this.logType = 'crawlerLog';
    this.viewLogsButton.nativeElement.click();
    this.closeReplicateModalButton.nativeElement.click();
  }

  uuidList:string[] = []
  isAllSelected:boolean = false;
  selectAllProvider(){
    this.uuidList = [];
    this.credilyProviderList.forEach(e=>{
      e.checked = !this.isAllSelected;
      if (!this.isAllSelected) {
        this.uuidList.push(e.uuid);
      }
    })
    this.isAllSelected = !this.isAllSelected;
    console.log('All uuidList: ',this.uuidList);
  } 

  selectSingleProvider(provider:any){
    debugger
    var i = this.uuidList.findIndex(uuid => uuid == provider.uuid);
    if (!provider.checked) {
      provider.checked = true;
      if (i == -1) {
        this.uuidList.push(provider.uuid);
      }
    } else {
      provider.checked = false;
      if (i > -1) {
        this.uuidList.splice(i, 1);
      }
    }

    var index = this.credilyProviderList.findIndex(x => x.checked == false);
    if (index > -1) {
      this.isAllSelected = false;
    } else {
      if(this.credilyProviderList.length == this.uuidList.length){
        this.isAllSelected = true;
      }
    }

  }

  logReplicateToggle:boolean = false;
  replicateLogs(){
    debugger
    this.logReplicateToggle = true;
    this.reportService.replicateLog(this.uuid, this.uuidList).subscribe(response=>{
      if(response){
        this.uuidList = [];
        this.uuid = '';
        this.isAllSelected = false;
        this.closeReplicateModalButton.nativeElement.click();
        this.pageToggle = true;
      
        // this.logType = 'crawlerLog';
        this.getProviderReport(this.filterType, 0);

      }
      this.logReplicateToggle = false;
    }, error=>{
      this.logReplicateToggle = false;
    })
  }

  @ViewChild('viewLogsButton') viewLogsButton!: ElementRef;
  uuid :any;
  providerName:string='';
  providerReqId:number=0;
  providerReqVersion:string = '';
  providerNpi:string='';
  viewLogs(providerUuid:string, providerName:string, providerReqId:number, version:string, npi:string){
    this.providerName = '';
    this.uuid = ''
    this.licenseCount = 0;
    this.rpaCount = 0;
    this.providerReqVersion = version;
    this.providerName = providerName;
    this.providerReqId = providerReqId;
    this.uuid = providerUuid;
    this.providerNpi = npi;
    this.viewLogsButton.nativeElement.click();
    this.getLogCount();

    this.clear();
    this.databaseHelper.currentPage = 1;
    this.logType = 'crawlerLog';
    this.getProviderLogs(this.uuid);

    this.uuidList = [];
    this.isAllSelected = false;
  }

  licenseCount:number=0;
  rpaCount:number=0;
  archiveCount:number=0;
  configNotFoundCount:number=0;
  countToggle: boolean = false;
  getLogCount(){
    this.countToggle = true;
    this.reportService.getLogCount(this.uuid, this.providerType, this.requestSource).subscribe(response=>{
      this.licenseCount = response.licenseCount;
      this.rpaCount = response.rpaCount;
      this.configNotFoundCount = response.configNotFoundCount;
      this.countToggle = false;
      if(this.providerType == 'scheduledProvider'){
        this.archiveCount = response.archiveCount;
      }
    },error=>{
      this.countToggle = false;
    })
  }

  providerCrawlerLogList:ProviderRequestCrawlerLog[]=new Array();
  logLoadingToggle:boolean = false;
 
  getProviderLogs(providerUuid:string){
    this.logLoadingToggle = true;
    this.providerCrawlerLogList = [];
    this.reportService.getProviderLogs(providerUuid, this.isRpaConfig, this.providerType, this.isArchive, this.isConfigNotFound, this.isOcrConfig, this.requestSource).subscribe(response=>{
      this.providerCrawlerLogList = response;
      this.logLoadingToggle = false;
    },error=>{
      this.logLoadingToggle = false;
    })
  }

  providerVersion: string = '';
  getOcrProviderAttachment(){
    this.providerCrawlerLogList = [];
    this.logLoadingToggle = true;
    // this.version= this.providerReqVersion;  changed version to providerVersion
    this.providerVersion= this.providerReqVersion;
    this.reportService.getOcrProviderAttachment(this.providerVersion, this.dataService.startDate, this.dataService.endDate, this.databaseHelper, this.dataService.isLiveAccount, this.uuid).subscribe(response=>{
      if(response != null){
        this.providerCrawlerLogList = response.list;
        // this.totalProviderAttachment = response.totalItems;
        console.log(this.providerCrawlerLogList)
      }
      this.logLoadingToggle = false;
    },error=>{
      this.logLoadingToggle = false;
    })
  }

  tempReRunIds: number[] = new Array();
  providerTestingToggle:boolean = false;
  showRpaRespToggle:boolean = false;
  message:string = '';
  reRunProviderLog(logId:number, index:number){
    debugger
    console.log("method called 1")
    this.tempReRunIds.push(logId);
    this.providerTestingToggle = true;
    this.providerCrawlerLogList[index].reTestingToggle = true;
    this.reportService.reRunProviderLog(logId, this.isRpaConfig).subscribe(response=>{
      if(response.status && response.message == null){
        if(this.isRpaConfig==1){
          this.showRpaRespToggle = true;
          setTimeout(() => {
            this.showRpaRespToggle = false;
          }, 800);
        } else {
          this.getProviderLogs(this.uuid);
          this.tempReRunIds = [];
        }
      } else {
        this.message = response.message;
        setTimeout(()=>{
          this.message = '';
        },1200)
      }
      this.providerTestingToggle = false;
      if(this.providerCrawlerLogList[index] && this.providerCrawlerLogList[index].reTestingToggle){
        this.providerCrawlerLogList[index].reTestingToggle = false;
      }
    },error=>{
      this.providerTestingToggle = false;
      this.providerCrawlerLogList[index].reTestingToggle = false;
    })
  }

  @ViewChild('closeLogsButton') closeLogsButton!:ElementRef;
  closeLogModel(){
    this.closeLogsButton.nativeElement.click();
  }
  
  @ViewChild('openSnapshotModalButton') openSnapshotModalButton !: ElementRef;
  imageUrl:string='';
  imageLoadingToggle:boolean = false;
  imageName:string='';
  imageExtension:string='';
  viewSnapshot(url:string, imageName:string){
    debugger
    // this.handleRenderPdf();
    this.imageName = imageName;
    this.imageLoadingToggle = true;
    this.imageUrl = url;
    this.imageExtension = this.getFileExtension(url);
    console.log("Ext: ",this.imageExtension)

    this.closeLogsButton.nativeElement.click();
    setTimeout(()=>{
      this.imageLoadingToggle = false;
    },1000)
    this.openSnapshotModalButton.nativeElement.click();
  }

  // getFileExtension(url: string): string {
  //   return url.split('.').pop() || '';
  // }

  getFileExtension(url: string): string {
    const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return match ? match[1] : '';
  }



// handleRenderPdf() {
  //   this.pdfService.getPdf().subscribe({next: (res) => {
  //       if (this.imageUrl) {
  //         PDFObject.embed(this.imageUrl, '#pdfContainer');
  //       }
  //     },
  //   });
  // }

  @ViewChild('closeSnapshotModalButton') closeSnapshotModalButton !: ElementRef;
  closeSnapshotModal(){
    this.closeSnapshotModalButton.nativeElement.click();
    this.viewLogsButton.nativeElement.click();
  }

  refreshProviderStatus(providerUuid:string, index:number){
    debugger
    this.providerList[index].refreshProviderLoading = true;
    this.reportService.refreshProviderStatus(providerUuid).subscribe(response=>{
      this.providerList[index].status = response.object;
      this.providerList[index].refreshProviderLoading = false;
    },error=>{
      this.providerList[index].refreshProviderLoading = false;
    })
  }

  refreshProviderLogs(){
    this.tempConfigIds = []
    this.getProviderLogs(this.uuid);
    this.getLogCount();
  }

  routeToConfiguration(obj:ProviderRequestCrawlerLog){
    this.reportService.getConfigId(obj.lookupName, obj.lookupLink).subscribe(response=>{
      if(response != null){
        this.closeLogModel();
        let navigateExtra : NavigationExtras = {
          queryParams : {"id" : response},
        };
        this.router.navigate([this.Route.HOME_CONFIGURATION_ROUTE], navigateExtra)
      }
    },error=>{

    })
  }

  @ViewChild('snapshotUploadButton') snapshotUploadButton !: ElementRef
  @ViewChild('closeSsUploadModal') closeSsUploadModal !: ElementRef
  configName:string='';
  openSnapshotUploadModal(logId:number, configName:string){
    this.progress =0;
    this.uploadingToggle = false;
    this.configName = '';
    this.fileName ='';
    this.configName = configName;
    this.snapshotRequest.logId = logId;
    this.closeLogsButton.nativeElement.click();
    this.snapshotUploadButton.nativeElement.click();
  }

  closeSnapShotUploadModal(){
    this.progress =0;
    this.uploadingToggle = false;
    this.configName = '';
    this.fileName ='';
    this.closeSsUploadModal.nativeElement.click();
    this.viewLogsButton.nativeElement.click();
    this.getProviderLogs(this.uuid);
  }

  snapshotRequest: SnapshotRequest = new SnapshotRequest();
  updatingSnapshotToggle:boolean = false
  uploadValidToggle:boolean =false;
  uploadSnapshot(){
    this.uploadValidToggle = false;
    if(this.Constant.EMPTY_STRINGS.includes(this.fileName)){
      this.uploadValidToggle = true;
      return;
    }
    this.updatingSnapshotToggle = true;
    this.reportService.uploadSnapshot(this.snapshotRequest).subscribe(response=>{
      if(response){
        this.closeSnapShotUploadModal();
      }
      this.updatingSnapshotToggle = false;
    },error=>{
      this.updatingSnapshotToggle = false;
    })
  }

  mapAgainLoadingToggle:boolean = false;
  showMapMessageToggle:boolean = false;
  mapSnapshotAgain(logId:number, index:number){
    this.mapAgainLoadingToggle = true;
    this.showMapMessageToggle = true;
    this.providerCrawlerLogList[index].mapAgainLoadingToggle = true;
    this.reportService.mapSnapshotAgain(logId).subscribe(response=>{
      this.mapAgainLoadingToggle = false;
      this.showMapMessageToggle = false;
      this.providerCrawlerLogList[index].mapAgainLoadingToggle = false;
    },error=>{
      this.mapAgainLoadingToggle = false;
      this.providerCrawlerLogList[index].mapAgainLoadingToggle = false;
    })
  }

  dropdownSettingsAttachmentType !: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
  selectedAttType: any[] = new Array();
  attTypeList: any[] = new Array();

  dropdownSettingsAttachmentSubType !: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
  selectedAttSubType: any[] = new Array();
  attSubTypeList: any[] = new Array();

  dropdownSettingsConfigType !: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
  configTypeList: any[] = [{id:1, itemName: 'License Lookup'}, {id:2, itemName: 'Board Certification'}, {id:3, itemName: 'DEA'}];
  selectedConfigType: any[] = new Array();

  dropdownSettingsConfigName !: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean; searchPlaceholderText: string; };
  selectedConfigName: any[] = new Array();
  configList: any[] = new Array();

  dropdownSettingsLicenseType!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean, lazyLoading: boolean };
  licenseTypeObj: LicenseTypeJson = new LicenseTypeJson();
  licenseTypeList: any[] = new Array();
  selectedLicenseType: any[] = new Array();



  attachmentTypeList: any[] = new Array()
  getAttachmentType() {
    this.attachmentTypeList =[];
    this.licenseLookupService.getAttachmentType().subscribe(response => {
      response.forEach((e: any) => {
        var temp: { id: any, itemName: any } = { id: e.id, itemName: e.name };
        this.attTypeList.push(temp);
      })
      this.attTypeList = JSON.parse(JSON.stringify(this.attTypeList));
    }, error => {

    })
  }

  attachmentId: number = 0;
  attachmentType: string = '';
  selectAttType(event: any) {
    debugger
    this.attSubTypeList = [];
    this.attachmentSubType = '';
    this.attachmentType = '';
    if (event != undefined && event.length > 0) {
      this.attachmentId = event[0].id;
      this.attachmentType = event[0].itemName;
      this.getAttachmentSubType();
    } else {
      this.selectedAttSubType = [];
    }
  }

  getAttachmentSubType() {
    this.licenseLookupService.getAttachmentSubType(this.attachmentId).subscribe(response => {
      response.forEach((e: any) => {
        var temp: { id: any, itemName: any, description: any, source: any  } = { id: e.id, itemName: e.name, description: e.description, source: e.source};
        this.attSubTypeList.push(temp);
      })
      this.attSubTypeList = JSON.parse(JSON.stringify(this.attSubTypeList));
    }, error => {

    })
  }

  getLicenseType() {
    this.licenseTypeList = [];
    this.licenseTypeObj.licenseType.forEach(element => {
      var temp: { id: any, itemName: any } = { id: '', itemName: '' };
      temp.id = element.id
      temp.itemName = element.licenseTypes
      this.licenseTypeList.push(temp);
    });
    this.licenseTypeList = JSON.parse(JSON.stringify(this.licenseTypeList));
  }

  licenseType:string='';
  selectLicenseType(event: any) {
    this.licenseType = '';
    if (event != undefined) {
      this.licenseType = event[0].itemName;
    }
  }

  selectedStateName: string='';

  attactmentSource:string='';
  attachmentSubType: string = '';
  attachmentSubTypeDescription: string = '';
  selectAttSubType(event: any) {
    debugger
    this.attachmentSubType = '';
    this.attachmentSubTypeDescription = '';
    this.attactmentSource = '';
    if (event != undefined && event.length > 0) {
      this.attachmentSubType = event[0].itemName;
      this.attachmentSubTypeDescription = event[0].description;
      this.attactmentSource = event[0].source;
    }
  }

  @ViewChild('createConfigModalButton') createConfigModalButton!: ElementRef
  @ViewChild('closeConfigModalButton') closeConfigModalButton!: ElementRef
  @ViewChild('createConfigForm') createConfigForm!: any;

  openCreateConfigModel(){
    this.createConfigForm.resetForm();
    this.licenseNumber = '';
    this.lookupLink = '';
    this.lookupName = '';
    this.selectedConfigName = [];
    this.selectedLicenseType=[];
    this.licenseType ='';
    this.attachmentType = '';
    this.attachmentSubType = '';
    this.selectedConfigType = [];
    this.selectedAttSubType = [];
    this.selectedAttType = [];
    this.selectedStateName = '';


    this.getAttachmentType();
    this.getAttachmentSubType();
    this.getLicenseType();
    this.createConfigModalButton.nativeElement.click();
  }
  closeConfigModal() {
    this.isConfigExistToggle = false;
    this.closeConfigModalButton.nativeElement.click();
    this.viewLogsButton.nativeElement.click();
  }

  lookupName:string='';
  lookupLink:string=''
  configType:string='';
  selectConfigType(event:any){
    debugger
    this.configType = '';
    this.selectedConfigName = []
    if(event != undefined){
      if(event[0].itemName == 'DEA') {
        this.configType = 'License Lookup';
        // this.getTaxonomyLink('DEA');
        this.getConfigurationLink('DEA');
      }  else {
        if(event[0].itemName == 'Common'){
          this.configType = 'Common';
        }
        this.configType = event[0].itemName
        // this.getTaxonomyLink('');
        this.getConfigurationLink('');
      }
    }
  }

  licenseNumber:string='';
  logConfigRequest : LogConfigRequest = new LogConfigRequest();
  configCreatingToggle:boolean = false;
  createConfig() {
    if(Constant.EMPTY_STRINGS.includes(this.configType)){
      return;
    }
    if(this.isConfigExistToggle){
      if(Constant.EMPTY_STRINGS.includes(this.lookupName)) {
        return;
      }
    } else {
      if(Constant.EMPTY_STRINGS.includes(this.attachmentType) || Constant.EMPTY_STRINGS.includes(this.attachmentSubType)){
        return;
      }
    }
    if(!this.Constant.EMPTY_STRINGS.includes(this.configMessage)){
      return;
    }

    if(this.configType == 'License Lookup') {
      if(Constant.EMPTY_STRINGS.includes(this.selectedStateName)){
        return;
      }
    }

    this.configCreatingToggle = true;
    this.logConfigRequest.lookupLink = this.lookupLink;
    this.logConfigRequest.lookupName = this.lookupName;
    this.logConfigRequest.attachmentType = this.attachmentType;
    this.logConfigRequest.attachmentSubType = this.attachmentSubType;
    this.logConfigRequest.attachmentTypeDesc = this.attachmentSubTypeDescription
    this.logConfigRequest.attactmentSource = this.attactmentSource;
    this.logConfigRequest.isConfigAlreadyExist = this.isConfigAlreadyExist;
    this.logConfigRequest.state = this.selectedStateName;
    this.logConfigRequest.licenseType = this.licenseType
    this.logConfigRequest.configType = this.configType
    this.logConfigRequest.licenseNumber = this.licenseNumber

    this.logConfigRequest.providerUuid = this.uuid;
    this.logConfigRequest.providerRequestId = this.providerReqId;

    this.reportService.createConfig(this.logConfigRequest).subscribe(response=>{
      if(response){
        this.closeConfigModal();
        this.getProviderLogs(this.uuid);
        this.isConfigExistToggle = false;
        this.logConfigRequest = new LogConfigRequest();
      }
      this.configCreatingToggle = false;
    },error=>{
      this.configCreatingToggle = false;
    })


  }

  configMatchLoadingToggle:boolean = false;
  configMessage:string='';
  matchConfigName(){
    this.configMessage = '';
    this.configMatchLoadingToggle = true;
    this.licenseLookupService.matchConfigName(this.lookupName).subscribe(response=>{
      if(!response) {
        this.configMessage = 'Config already exists with this name.';
      }
      this.configMatchLoadingToggle = false;
    },error=>{
      this.configMatchLoadingToggle = false;
    })
  }

  @Output() stateDropdown = new EventEmitter();
  isConfigExistToggle:boolean = false;
  isConfigAlreadyExist:number=0;
  isConfigExist(event:any){
    debugger
    this.lookupLink = '';
    this.lookupName = '';
    this.selectedConfigName = [];
    this.selectedLicenseType=[];
    this.licenseType ='';
    this.attachmentType = '';
    this.attachmentSubType = '';
    this.selectedConfigType = [];
    this.selectedAttSubType = [];
    this.selectedAttType = [];
    this.selectedConfigName = [];
    this.selectedStateName = '';

    this.licenseNumber = '';
    this.isConfigAlreadyExist = 0;
    this.isConfigExistToggle = !this.isConfigExistToggle;
    if(this.isConfigExistToggle) {
      this.isConfigAlreadyExist = 1;
      // this.getTaxonomyLink('');
      this.getConfigurationLink('');
    }
  }

  onSearchLink(event: any) {
    debugger
    // this.getTaxonomyLink(event.target.value); //commented by amit
    this.getConfigurationLink(event.target.value);
  }

  taxanomyLinkLoading: boolean = false;
  getTaxonomyLink(search: string) {
    debugger
    if (!this.Constant.EMPTY_STRINGS.includes(this.lookupLink)) {
      this.taxanomyLinkLoading = true;
    }
    this.licenseLookupService.getTaxonomyLink(search, this.configType).subscribe(response => {
      if (response.object != null) {
        this.configList = [];
        response.object.forEach((element: any) => {
          var temp: { id: any, itemName: any } = { id: element.link, itemName: element.name };
          this.configList.push(temp);
        })
      }
      this.taxanomyLinkLoading = false;
    }, error => {
      this.taxanomyLinkLoading = false;
    })
    this.configList = JSON.parse(JSON.stringify(this.configList));
  }

  selectTaxonomyLink(event: any) {
    debugger
    this.lookupLink = '';
    this.lookupName = '';
    this.selectedConfigName = [];
    if (event != undefined && event.length>0) {
      this.selectedConfigName.push(event[0]);
      this.lookupLink = event[0].id;
      this.lookupName = event[0].itemName;
    }
  }

  getConfigurationLink(search: string) {
    debugger
    if (!this.Constant.EMPTY_STRINGS.includes(this.lookupLink)) {
      this.taxanomyLinkLoading = true;
    }
    this.licenseLookupService.getConfigurationLink(search, this.configType).subscribe(response => {
      if (response.object != null) {
        this.configList = [];
        response.object.forEach((element: any) => {
          var temp: { id: any, itemName: any } = { id: element.link, itemName: element.name };
          this.configList.push(temp);
        })
      }
      this.taxanomyLinkLoading = false;
    }, error => {
      this.taxanomyLinkLoading = false;
    })
    this.configList = JSON.parse(JSON.stringify(this.configList));
  }

  @ViewChild('deleteModalButton') deleteModalButton!: ElementRef;
  @ViewChild('deleteCloseModalButton') deleteCloseModalButton!: ElementRef;

  logId:number=0;
  openDeleteLogModal(logId:number){
    this.logId = logId;
    this.deleteModalButton.nativeElement.click();
  }

  closeDeleteLogModal(){
    this.deleteCloseModalButton.nativeElement.click();
    this.viewLogsButton.nativeElement.click();
  }

  deletingLogToggle:boolean = false;
  deleteLog(){
    this.deletingLogToggle = true;
    this.reportService.deleteLog(this.logId).subscribe(response=>{
      if(response){
        this.closeDeleteLogModal();
        this.getProviderLogs(this.uuid);
      }
      this.deletingLogToggle = false;
    },error=>{
      this.deletingLogToggle = false;
    })
  }

  

  // --------------------------- firebase doc upload section start --------------------------------------

  uploadedToggle: boolean = false;
  uploadingToggle: boolean = false;
  currentUpload: any;
  urls: any[] = new Array();
  files: any[] = new Array();
  selectedFiles: any[] = new Array();
  tempProgress: number = 0;
  progress: number = 0;
  fileName: string = "";
  fileExtension:string='';
  urlString:string='';
 
  currentCount: any;
  fileUrlErrorMessage:boolean = false;

  onDrop(event: any) {
    debugger
    this.uploadingToggle = true;
    this.urls = new Array();
    this.files = new Array();
    this.selectedFiles = event;
    this.files = event[0];
    this.urls = event[0];
    this.uploadMulti();
  }


  onSelectFile(event: any) {
    debugger
    this.uploadingToggle = true;
    this.urls = new Array();
    this.files = new Array();
    this.selectedFiles = event.target.files;
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        const element = event.target.files[i];
        this.files.push(element.name);
        var reader = new FileReader();
        reader.onload = (event2: any) => {
          this.urls.push(event2.target.result);
          if (this.urls.length == event.target.files.length) {
            this.uploadMulti();
          }
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    } else {
      this.uploadingToggle = false
      this.uploadedToggle = false
    }
  }

  uploadMulti() {
    debugger
    let files = this.selectedFiles;
    let filesIndex = _.range(files.length);
    this.pushUpload(filesIndex, files);
    this.urls = new Array();
  }

  pushUpload(filesIndex: any, files: any) {
    debugger
    this.urlString = '';
    _.each(filesIndex, async (idx: any) => {
      this.currentCount++;
      this.currentUpload = new ImageUpload(files[idx]);
      this.fileExtension = this.currentUpload.file.type;

      let fileExt;
      if(this.fileExtension.includes("/")){
        fileExt = this.fileExtension.split("/")[1];
      } else {
        fileExt = this.fileExtension;
      }

      this.providerName = this.dataService.getNameInTitleCase(this.providerName);

      let firebasePath = "crawler-manual-upload/"+ this.uuid +"_"+ this.providerName+"/"+this.configName + moment(new Date()).format('MMMDD_YYYY_hh_mm_ss')+'.'+fileExt;
      this.fileName = this.providerName + "_" + this.configName+"_"+ moment(new Date()).format('MMMDD_YYYY_hh_mm_ss')+'.'+fileExt;

      const fileRef = this.firebaseStorage.ref(firebasePath);
      
      this.firebaseStorage.upload(firebasePath, this.currentUpload.file).snapshotChanges().pipe(
        finalize(async () => {
          fileRef.getDownloadURL().subscribe((url: any) => {
            this.urlString = url;
            this.snapshotRequest.url = url;
            this.fileUrlErrorMessage = false;

            this.uploadedToggle = true;
            this.uploadingToggle = false;
          });
        })
      ).subscribe((res: any) => {
        if (((res.bytesTransferred / res.totalBytes) * 100) == 100) {
          this.tempProgress = (res.bytesTransferred / res.totalBytes) * 100;;
          this.progress = this.tempProgress;
        }
        if (((res.bytesTransferred / res.totalBytes) * 100) < 100 && ((res.bytesTransferred / res.totalBytes) * 100) > this.progress) {
          this.progress = (res.bytesTransferred / res.totalBytes) * 100;
        }
        if (this.tempProgress == this.currentCount * 100) {
          this.progress = this.tempProgress;
        }
      })
    });
  }

  resetUpload() {
    this.uploadedToggle = false;
    this.fileName = '';
    this.urlString = '';
  }

  // --------------------------- firebase doc upload section end --------------------------------------

  tempConfigIds: number[] = new Array();
  configAIReRun(id : any){
    debugger
    this.tempConfigIds.push(id);
    this.reportService.configAIReRun(id).subscribe((res: any) => {
      if (res) {
        this.dataService.showToast('AI Config re-run successfully.', 'success');
      }
    }, error => {
      this.dataService.showToast('Something went wrong.', 'error');
    })
  }

  tempMarkedConfigIds: number[] = new Array();
  markAsComplete(id : any){
    this.tempMarkedConfigIds.push(id);
    this.reportService.markAsComplete(id).subscribe((res: any) => {
      if (res) {
        this.dataService.showToast('Marked as complete successfully.', 'success');
      }
    }, error => {
      this.dataService.showToast('Something went wrong.', 'error');
    })
  }

  markAsRead(obj: any) {
    if (obj.isRead === 0) {
      obj.isRead = 1;
  
      this.reportService.markAsRead(obj.id).subscribe({
        next: () => {},
        error: () => {
          obj.isRead = 0;
        }
      });
    }
  }  

  @ViewChild('showOcrDataModalButton') showOcrDataModalButton!:ElementRef
  openOcrDataModal(attachmentId:number, crawlerLogId:number, lookupName:string){
    this.ocrAttachmentId = attachmentId;
    this.ocrCrawlerLogId = crawlerLogId;
    this.ocrConfigName = lookupName;
    this.getAttachmentOcrData(attachmentId, crawlerLogId, lookupName);
    this.showOcrDataModalButton.nativeElement.click();
  }

  closeOcrDataModal(){
    this.editToggle = false;
    this.viewLogsButton.nativeElement.click();
    // this.showOcrDataModalButton.nativeElement.click();
  }

  ocrDataLoadingToggle:boolean = false;
  keys : any[]  = new Array();
  myMap: any;
  getAttachmentOcrData(attachmentId:number, crawlerLogId:number, lookupName:string){
    debugger
    this.keys = [];
    this.ocrDataLoadingToggle = true;
    this.reportService.getAttachmentOcrData(this.providerReqVersion, attachmentId, crawlerLogId, lookupName).subscribe(response=>{
    // this.reportService.getAttachmentOcrData(this.version, attachmentId, crawlerLogId).subscribe(response=>{
      if(response!=null){
        this.myMap = response;
        Object.keys(response).forEach(element => {
          this.keys.push(element);
        });
      }
      this.ocrDataLoadingToggle = false;
    },error=>{
      this.ocrDataLoadingToggle = false;
    })
  }

  editToggle:boolean = false;
  editedOcrData:any = {};
  editOcrData(){
    this.editToggle = !this.editToggle;
  }

  updateOcrToggle: boolean = false;
  ocrAttachmentId:number = 0;
  ocrCrawlerLogId:number = 0;
  ocrConfigName: string = ''
  updateOcrData(myMap: any){
    this.updateOcrToggle = true;
    this.reportService.updateOcrData(this.ocrAttachmentId, this.ocrCrawlerLogId, this.ocrConfigName, this.providerReqVersion, myMap).subscribe(response=>{
      if(response){
        this.ocrAttachmentId = 0;
        this.ocrCrawlerLogId = 0;
        this.ocrConfigName = '';
        this.editToggle = false;
        this.updateOcrToggle = false;
        this.dataService.showToast('Updated successfully.', 'success');
      }
    },error=>{
      this.dataService.showToast('Something went wrong.', 'error');
    })
  }


  refetchManual(){
    this.refetchManualByProvider(this.uuid);
  }
    

  isRefetchingManualByProvider:boolean = false;
  refetchManualByProvider(providerUuid:string){
    this.isRefetchingManualByProvider = true;
    this.reportService.refetchManualByProvider(providerUuid).subscribe(response=>{
      this.isRefetchingManualByProvider = false;
    },error=>{
      this.isRefetchingManualByProvider = false;
    })
  }
}
