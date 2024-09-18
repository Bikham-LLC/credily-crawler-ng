import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Constant } from 'src/app/models/Constant';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { ProviderReport } from 'src/app/models/ProviderReport';
import { ProviderRequestCrawlerLog } from 'src/app/models/ProviderRequestCrawlerLog';
import { Route } from 'src/app/models/Route';
import { DataService } from 'src/app/services/data.service';
import { HeaderSubscriptionService } from 'src/app/services/header-subscription.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-re-fetch-report',
  templateUrl: './re-fetch-report.component.html',
  styleUrls: ['./re-fetch-report.component.css']
})
export class ReFetchReportComponent implements OnInit {

  readonly Constant = Constant;
  readonly Route = Route;
  
  providerSearch = new Subject<string>();
  constructor(private reportService: ReportService,
    private dataService: DataService,
    private router : Router,
    private headerSubscriptionService: HeaderSubscriptionService) { 

      this.subscribeHeader = this.headerSubscriptionService.headerVisibilityChange.subscribe(async (value) => {
        debugger
        // if(router.url == Route.RE_FETCH_REPORT){
        // this.getReFetchReport();
        // }
        this.getReFetchReport();
      })

      this.providerSearch.pipe(
        debounceTime(600))
        .subscribe(value => {
          this.databaseHelper.currentPage = 1;
          this.getReFetchReport();
        });
    }

  subscribeHeader :any;
  ngOnInit(): void {
    this.getReFetchReport();
  }

  databaseHelper:DatabaseHelper = new DatabaseHelper();

  providerList: ProviderReport[] = new Array();
  totalProviders:number=0;
  reportLoadingToggle:boolean = false;
  getReFetchReport(){
    this.reportLoadingToggle = true;
    this.reportService.getReFetchLicenseReport(this.databaseHelper, this.dataService.startDate, this.dataService.endDate).subscribe(response=>{
      if(response.status){
        this.providerList = response.object;
        this.totalProviders = response.totalItems;
      }
      this.reportLoadingToggle = false;
    }, error=>{
      this.reportLoadingToggle = false;
    })
  }

  pageChanged(event:any){
    this.databaseHelper.currentPage = event;
    this.getReFetchReport();
  }

  @ViewChild('reFetchLogButton') reFetchLogButton!: ElementRef
  reFetchLogList: ProviderRequestCrawlerLog[] = new Array();
  reFetchSnapReportLoading:boolean = false
  providerName:string='';
  providerReqId:number =0;
  openRefetchReportModal(providerReqId:number, providerName:string){
    this.providerReqId = providerReqId;
    this.providerName = '';
    this.providerName = providerName;
    this.reFetchLogButton.nativeElement.click();
    this.getReFetchSnapshotReport();
  }

  getReFetchSnapshotReport(){
    this.reFetchSnapReportLoading = true;
    this.reportService.getReFetchSnapshotReport(this.providerReqId).subscribe(response=>{
      if(response != null){
        this.reFetchLogList = response;
      }
      this.reFetchSnapReportLoading = false;
    },error=>{
      this.reFetchSnapReportLoading = false;
    });
  }

  @ViewChild('openImageModalButton') openImageModalButton!: ElementRef
  @ViewChild('closeImageModalButton') closeImageModalButton!: ElementRef

  imageLoadingToggle:boolean = false;
  imageUrl:string='';
  openImageModal(url:string){
    this.openImageModalButton.nativeElement.click();
    this.imageLoadingToggle = true;
    setTimeout(() => {
      this.imageLoadingToggle = false;
    }, 1000);
    this.imageUrl = url;
  }

  closeImageModal(){
    this.closeImageModalButton.nativeElement.click();
    this.reFetchLogButton.nativeElement.click();
  }

}
