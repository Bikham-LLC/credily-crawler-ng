import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { debounce, set } from 'lodash';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Constant } from 'src/app/models/Constant';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { Route } from 'src/app/models/Route';
import { DataService } from 'src/app/services/data.service';
import { HeaderSubscriptionService } from 'src/app/services/header-subscription.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {  
  readonly Constant = Constant;

  databaseHelper: DatabaseHelper = new DatabaseHelper();
  // version: any;
  // status: any;
  requestSource: any = 'Scheduler'
  versionList: any[] = [{id:'V2', itemName:'Credily'}, {id:'V3', itemName:'Provider Passport'}];
  statusList: any[]= [];
  dropdownSettingsVersion!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean, badgeShowLimit: number; };
  dropdownSettingsStatus!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean, badgeShowLimit: number; };

 
  search = new Subject<string>();

  fetchingReport: boolean = false;

  constructor(private reportService: ReportService,
    private dataService: DataService,
    private router: Router,
    private headerSubscription: HeaderSubscriptionService
  ) {

    this.search.pipe(
      debounceTime(600))
      .subscribe(value => {
        this.databaseHelper.currentPage = 1;
        this.refreshData();
      });

    this.subscribeHeader = this.headerSubscription.headerVisibilityChange.subscribe(async (value) => {
      debugger
      if (router.url == Route.SCHEDULER_MODULE) {
        this.refreshData();
      }
      console.log('In constructor - ' + this.subscribeHeader?.destination?.closed)
    })
  }

  subscribeHeader: any

  ngOnInit(): void {

    this.dropdownSettingsVersion = {
      singleSelection: true,
      text: 'Select Version',
      enableSearchFilter: false,
      autoPosition: false,
      badgeShowLimit: 1
    };

    this.dropdownSettingsStatus = {
      singleSelection: true,
      text: 'Select Status',
      enableSearchFilter: false,
      autoPosition: false,
      badgeShowLimit: 1
    };

    this.getBulkCrawlerLog(0);
    this.getBulkCrawlerLogCount();
    this.getDistinctStatus();
  }

  updateRequestSource(source: string) {
    this.requestSource = source;
    this.refreshData();
  }

  crawlerLogList: any[] = new Array();
  getBulkCrawlerLog(isPageChange: number){
    this.fetchingReport = true;
    this.databaseHelper.currentPage = this.p;
    if (!this.pageToggle) {
      this.p = 1;
      this.databaseHelper.currentPage = this.p;
    }

    this.reportService.getBulkCrawlerLog(this.databaseHelper, this.dataService.startDate, this.dataService.endDate,
      this.version, this.status, this.requestSource, this.dataService.isLiveAccount).subscribe((res: any)=>{
        this.pageToggle = false;
        this.crawlerLogList = res;
        this.fetchingReport = false;
      }, error => {
        this.fetchingReport = false;
      }
      )
  }
  crawlerLogTotalCount: any
  getBulkCrawlerLogCount(){
    this.reportService.getBulkCrawlerLogCount(this.databaseHelper, this.dataService.startDate, this.dataService.endDate,
      this.version, this.status, this.requestSource, this.dataService.isLiveAccount).subscribe((res: any)=>{
        this.crawlerLogTotalCount = res;
      })
  }

  logId: number = 0;
  isSingleReRunLoading = false
  singleReRunProvider(logId: number) {
    this.isSingleReRunLoading = true
    this.logId = logId;
    this.reportService.reRunProviderLog(logId, 0).subscribe(res => {
      this.isSingleReRunLoading = false
      if (res.status && res.message == null) {
        console.log(`re-run successful for log ID: ${logId}`);
      } else {
        console.error(`re-run failed`);
      }
      this.refreshData();
    })
  }

  getDistinctStatus() {
    this.reportService.getDistinctStatus().subscribe((res: any) => {
      this.statusList = res.map((status: string) => ({
        id: status, 
        itemName: status
      }));
    })
  }
  selectedStatus: any[] = new Array();
  status:string ='' ;
  selectStatus(event:any){
    debugger
    this.status = '';
    if(event != undefined && event.length > 0){
      this.status = event[0].id;
    }
    this.getBulkCrawlerLog(0);
    this.getBulkCrawlerLogCount();
  }

  selectedVersion: any[] = new Array();
  version:string='';
  selectVersion(event:any){
    debugger
    this.version = '';
    if(event != undefined && event.length > 0){
      this.version = event[0].id;
    }
    this.getBulkCrawlerLog(0)
    this.getBulkCrawlerLogCount();
  }

  p: number = 1;
  pageToggle: boolean = false
  pageChanged(event: any) {
    this.pageToggle = true;
    this.databaseHelper.currentPage = event;
    this.p = event;
    this.getBulkCrawlerLog(0);
  }

  refreshData() {
    this.getBulkCrawlerLog(0);
    this.getBulkCrawlerLogCount();
    this.getDistinctStatus();
  }

  clearSearch() {
    this.databaseHelper.search = '';
    this.search.next('');
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
    this.openSnapshotModalButton.nativeElement.click();

    console.log("Ext: ",this.imageExtension)

    // this.closeLogsButton.nativeElement.click();
    setTimeout(()=>{
      this.imageLoadingToggle = false;
    },1000)
    this.openSnapshotModalButton.nativeElement.click();
  }

  getFileExtension(url: string): string {
    const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return match ? match[1] : '';
  }

  @ViewChild('closeSnapshotModalButton') closeSnapshotModalButton !: ElementRef;
  closeSnapshotModal(){
    this.closeSnapshotModalButton.nativeElement.click();
    // this.viewLogsButton.nativeElement.click();
  }
}
