import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Constant } from 'src/app/models/Constant';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { LookupConfiguration } from 'src/app/models/LookupConfiguration';
import { Route } from 'src/app/models/Route';
import { TestReport } from 'src/app/models/TestReport';
import { DataService } from 'src/app/services/data.service';
import { HeaderSubscriptionService } from 'src/app/services/header-subscription.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-test-report',
  templateUrl: './test-report.component.html',
  styleUrls: ['./test-report.component.css']
})
export class TestReportComponent implements OnInit {

  configSearch = new Subject<string>();
  readonly Route = Route;
  readonly Constant = Constant;
  constructor(private reportService: ReportService,
    private dataService: DataService,
    private router : Router,
    private headerSubscriptionService: HeaderSubscriptionService) { 
      this.subscribeHeader = this.headerSubscriptionService.headerVisibilityChange.subscribe(async (value) => {
        debugger
        if(router.url == Route.TEST_REPORT){
          this.getConfigReport(this.statusFilter, 0);
          this.getCountTestConfigReport();
        }
      })
    }

  ngOnInit(): void {

    this.configSearch.pipe(
      debounceTime(600))
      .subscribe(value => {
        this.databaseHelper.currentPage = 1;
        this.getConfigReport(this.statusFilter, 0);
      });
      
      this.getConfigReport(this.statusFilter, 0);
      this.getCountTestConfigReport();
  }

  subscribeHeader:any;

  completedCount : number =0;
  failedCount : number =0;
  getCountTestConfigReport(){
    this.reportService.getCountTestConfigReport(this.dataService.startDate, this.dataService.endDate).subscribe(response=>{
      if(response != null){
        this.completedCount = response.completedCount;
        this.failedCount = response.failedCount;
      }
    },error=>{

    })
  }

  statusFilter : string = '';
  loadingConfigReport: boolean = false;
  configList: TestReport[] = new Array();
  totalConfiguration: number = 0;
  databaseHelper: DatabaseHelper = new DatabaseHelper();
  getConfigReport(statusFilter:string, isPageChanged:number) {
    this.loadingConfigReport = true;
    if(this.statusFilter == statusFilter && isPageChanged != 1){
      this.statusFilter = '';
    } else {
      this.statusFilter = statusFilter;
    }
    this.dataService.startDate = new Date(this.dataService.selected.startDate.toDate()).toDateString();
    this.dataService.endDate = new Date(this.dataService.selected.endDate.toDate()).toDateString();
    this.reportService.getTestConfigReport(this.databaseHelper, this.dataService.startDate, this.dataService.endDate, this.statusFilter).subscribe(response => {
      if (response.status && response.object != null) {
        this.configList = response.object;
        this.totalConfiguration = response.totalItems;
      }
      this.loadingConfigReport = false;
    }, error => {
      this.loadingConfigReport = false;
    })
  }



  configPageChanged(event: any) {
    if (event != this.databaseHelper.currentPage) {
      this.databaseHelper.currentPage = event;
      this.getConfigReport(this.statusFilter, 1);
    }
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
    if(this.viewTime == 'secondView'){
      this.viewMultipleSnapshots(this.logId);
    }
  }

  @ViewChild('openSnapshotModalButton') openSnapshotModalButton !: ElementRef;
  imageUrl:string='';
  viewTime:string = '';
  imageLoadingToggle:boolean = false;
  viewSnapshot(url:string, view:string){
    debugger
    this.imageLoadingToggle = true;
    this.imageUrl = url;
    this.viewTime = view;
    this.imageExtension = this.getFileExtension(url);
    this.openSnapshotModalButton.nativeElement.click();
    setTimeout(()=>{
      this.imageLoadingToggle = false;
    },1000)
  }

  imageExtension:string='';
  getFileExtension(url: string): string {
    const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return match ? match[1] : '';
  }


  @ViewChild('viewModalButton') viewModalButton! : ElementRef;
  
  logId:number = 0;
  viewMultipleSnapshots(id:number){
    this.logId = id;
    this.viewModalButton.nativeElement.click(); 
    this.getScreenshot(id);
  }

  configSnapshotList:any[] = new Array();
  shapshotLoadingToggle:boolean = false;
  getScreenshot(id:number){
    this.shapshotLoadingToggle = true;
    this.reportService.getScreenshot(id).subscribe(response=>{
      this.configSnapshotList = response;
      this.shapshotLoadingToggle = false;
    }, error=>{
      this.shapshotLoadingToggle = false;
    })
  }

}
