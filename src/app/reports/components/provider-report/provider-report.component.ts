import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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


@Component({
  selector: 'app-provider-report',
  templateUrl: './provider-report.component.html',
  styleUrls: ['./provider-report.component.css']
})
export class ProviderReportComponent implements OnInit {

  readonly Route = Route;
  readonly Constant = Constant;
 
  dropdownSettingsVersion!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean, badgeShowLimit: number; };
  versionList: any[] = [{id:'V2', itemName:'V2'}, {id:'V3', itemName:'V3'}];
  selectedVersion: any[] = new Array();

  providerSearch = new Subject<string>();
  constructor( private reportService:ReportService,
    private router : Router,
    private dataService: DataService,
    private firebaseStorage: AngularFireStorage,
    private headerSubscriptionService: HeaderSubscriptionService,
    ) { 

    this.providerSearch.pipe(
      debounceTime(600))
      .subscribe(value => {
        this.databaseHelper.currentPage = 1;
        this.getProviderReport(this.filterType, 0);
      });

      this.subscribeHeader = this.headerSubscriptionService.headerVisibilityChange.subscribe(async (value) => {
        debugger
        if(router.url == Route.PROVIDER_REPORT){
          this.getProviderReport(this.filterType, 0);
          this.getProviderReportCount();
        }
      })
  }

  subscribeHeader :any;
  ngOnInit(): void {
    this.dropdownSettingsVersion = {
      singleSelection: true,
      text: 'Select Version',
      enableSearchFilter: false,
      autoPosition: false,
      badgeShowLimit: 1
    };
    this.getProviderReport(this.filterType, 0);
    this.getProviderReportCount();
  }

  databaseHelper:DatabaseHelper = new DatabaseHelper();
  providerList:ProviderReport[] = new Array();
  totalProviders:number=0;
  fetchingReport:boolean=false;
  status:string='';

  completedCount:number =0;
  partiallyCompletedCount:number =0;
  getProviderReportCount(){
    this.reportService.getProviderReportCount(this.dataService.startDate, this.dataService.endDate, this.version, this.providerType).subscribe(response=>{
      if(response != null){
        this.completedCount = response.completedCount;
        this.partiallyCompletedCount = response.partiallyCompletedCount;
      }
    },error=>{

    })
  }

  providerType:string = 'licensed';
  switchProviderType(type:string){
    this.providerType = type;
    this.getProviderReport(this.filterType, 0);
    this.getProviderReportCount();
  }

  getProviderReport(filterType:string, isPageChange:number){
    debugger
    this.fetchingReport = true;
    if(this.filterType == filterType && isPageChange != 1){
      this.filterType = '';
    } else {
      this.filterType = filterType;
    }
    this.reportService.getProviderReport(this.databaseHelper, this.filterType, this.dataService.startDate, this.dataService.endDate, this.version, this.providerType).subscribe(response => {
      if(response!=null){
        this.providerList = response.object;
        this.totalProviders = response.totalItems;
      }
      this.fetchingReport = false;
    }, error => {
      this.fetchingReport = false;
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

  pageChanged(event:any){
    debugger
    this.databaseHelper.currentPage = event;
    this.getProviderReport(this.filterType, 1);
  }

  logType:string='crawlerLog';
  isRpaConfig:number=0;
  switchLogTab(tab:string){
    this.logType = tab;
    if(tab == 'rpaLog'){
      this.isRpaConfig = 1;
    } else {
      this.isRpaConfig = 0;
    }
    this.getProviderLogs(this.uuid);
  }

  @ViewChild('viewLogsButton') viewLogsButton!: ElementRef;
  uuid :any;
  providerName:string='';
  viewLogs(providerUuid:string, providerName:string){
    this.providerName = '';
    this.providerName = providerName;
    this.uuid = providerUuid;
    this.viewLogsButton.nativeElement.click();
    this.getProviderLogs(this.uuid);
  }

  providerCrawlerLogList:ProviderRequestCrawlerLog[]=new Array();
  logLoadingToggle:boolean = false;
  getProviderLogs(providerUuid:string){
    this.logLoadingToggle = true;
    this.reportService.getProviderLogs(providerUuid, this.isRpaConfig).subscribe(response=>{
      this.providerCrawlerLogList = response;
      this.logLoadingToggle = false;
    },error=>{
      this.logLoadingToggle = false;
    })
  }

  providerTestingToggle:boolean = false;
  showRpaRespToggle:boolean = false;
  message:string = '';
  reRunProviderLog(logId:number, index:number){
    debugger
    this.providerTestingToggle = true;
    this.providerCrawlerLogList[index].reTestingToggle = true;
    if(this.logType == 'rpaLog'){
     this.reportService.reRunRpaConfig(logId).subscribe(response=>{
      if(response){
        this.showRpaRespToggle = true;

        setTimeout(() => {
          this.showRpaRespToggle = false;
        }, 800);
      }
      this.providerCrawlerLogList[index].reTestingToggle = false;
      this.providerTestingToggle = false;
     },error=>{
      this.providerTestingToggle = false;
      this.providerCrawlerLogList[index].reTestingToggle = false;
     })
    } else {
      this.reportService.reRunProviderLog(logId).subscribe(response=>{
        if(response.status && response.message == null){
          this.getProviderLogs(this.uuid);
        } else {
          this.message = response.message;
          setTimeout(()=>{
            this.message = '';
          },1200)
        }
        this.providerCrawlerLogList[index].reTestingToggle = false;
        this.providerTestingToggle = false;
      },error=>{
        this.providerTestingToggle = false;
        this.providerCrawlerLogList[index].reTestingToggle = false;
      })
    }
  }

  @ViewChild('closeLogsButton') closeLogsButton!:ElementRef;
  closeLogModel(){
    this.closeLogsButton.nativeElement.click();
  }
  
  @ViewChild('openSnapshotModalButton') openSnapshotModalButton !: ElementRef;
  imageUrl:string='';
  imageLoadingToggle:boolean = false;
  viewSnapshot(url:string){
    debugger
    this.imageLoadingToggle = true;
    this.imageUrl = url;
    this.closeLogsButton.nativeElement.click();
    setTimeout(()=>{
      this.imageLoadingToggle = false;
    },1000)
    this.openSnapshotModalButton.nativeElement.click();
  }

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
    this.getProviderLogs(this.uuid);
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
  updateSnapshot(){
    this.uploadValidToggle = false;
    if(this.Constant.EMPTY_STRINGS.includes(this.fileName)){
      this.uploadValidToggle = true;
      return;
    }
    this.updatingSnapshotToggle = true;
    this.reportService.updateSnapshot(this.snapshotRequest).subscribe(response=>{
      if(response){
        this.closeSnapShotUploadModal();
      }
      this.updatingSnapshotToggle = false;
    },error=>{
      this.updatingSnapshotToggle = false;
    })
  }



  // --------------------------- firebase doc upload section --------------------------------------

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

      let firebaseName = "crawler-manual-upload/"+ this.uuid +"_"+ this.providerName+"/"+this.configName + moment(new Date()).format('MMMDD_YYYY_hh_mm_ss');
      this.fileName = this.providerName + "_" + this.configName+"_"+ moment(new Date()).format('MMMDD_YYYY_hh_mm_ss');
      
    
      // var storageRef = this.firebaseStorage.storage.ref();
      // const fileRef = storageRef.child(firebaseName);

      const fileRef = this.firebaseStorage.ref(firebaseName);
      
      this.firebaseStorage.upload(firebaseName, this.currentUpload.file).snapshotChanges().pipe(
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

}
