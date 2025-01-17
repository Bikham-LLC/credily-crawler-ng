import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Constant } from 'src/app/models/Constant';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { Route } from 'src/app/models/Route';
import { RpaReportDTO } from 'src/app/models/RpaReportDTO';
import { DataService } from 'src/app/services/data.service';
import { HeaderSubscriptionService } from 'src/app/services/header-subscription.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-rpa-report',
  templateUrl: './rpa-report.component.html',
  styleUrls: ['./rpa-report.component.css']
})
export class RpaReportComponent implements OnInit {

  readonly Route = Route;
  readonly Constant = Constant;
  isHeaderServiceCall: boolean = false;

  constructor(private reportService: ReportService,
    private dataService: DataService,
    private router : Router,
    private headerSubscriptionService: HeaderSubscriptionService) {

      this.providerSearch.pipe(
        debounceTime(600))
        .subscribe(value => {
          this.databaseHelper.currentPage = 1;
          this.getRpaReport(this.filterType, 0);
        });
  
        this.subscribeHeader = this.headerSubscriptionService.headerVisibilityChange.subscribe(async (value) => {
          debugger
          if(router.url == Route.RPA_REPORT){
            if(!this.isHeaderServiceCall){
              this.getRpaReport(this.filterType, 0);
              this.getRpaReportCount();
            }
            this.isHeaderServiceCall = false;
          }
        })

    }


  subscribeHeader :any;
  
  ngOnInit(): void {
    if(!this.isHeaderServiceCall){
      this.isHeaderServiceCall = true;
      this.dataService.isLiveAccount = 1
      this.getRpaReport(this.filterType, 0);
      this.getRpaReportCount();
    }
  }

  ngOnDestroy(){
    this.subscribeHeader.complete();
  }

  providerSearch = new Subject<string>();
  
  databaseHelper: DatabaseHelper = new DatabaseHelper();
  reportLoadingToggle:boolean = false;
  providerList:RpaReportDTO[] = new Array();
  totalProviders:number=0;
  filterType:string='';
  getRpaReport(filterType:string, isPageChange:number) {
    this.providerList = [];
    if(this.filterType == filterType && isPageChange != 1){
      this.filterType = '';
    } else {
      this.filterType = filterType;
    }

    this.reportLoadingToggle = true;
    this.reportService.getRpaReport(this.databaseHelper, this.dataService.startDate, this.dataService.endDate, this.filterType, this.dataService.isLiveAccount).subscribe(response=>{
      if(response){
        this.providerList = response.object;
        this.totalProviders = response.totalItems;
      }
      this.reportLoadingToggle = false;
    },error=>{
      this.reportLoadingToggle = false;
    })
  }

  completedCount:number=0;
  pendingCount:number=0;
  getRpaReportCount(){
    this.reportService.getRpaReportCount(this.dataService.startDate, this.dataService.endDate).subscribe(response=>{
      if(response != null){
        this.completedCount = response.completedCount;
        this.pendingCount = response.pendingCount;
      }
    },error=>{

    })
  }

  pageChanged(event:any){
    if(event != undefined){
      this.databaseHelper.currentPage = event;
      this.getRpaReport(this.filterType, 1);
    }
  }

  @ViewChild('openSnapshotModalButton') openSnapshotModalButton!: ElementRef;
  imageUrl:string='';
  imageLoadingToggle:boolean = false;
  openImage(url:string){
    this.imageUrl = url;
    this.imageLoadingToggle = true;
    this.openSnapshotModalButton.nativeElement.click();
    setTimeout(() => {
      this.imageLoadingToggle = false;
    }, 1200);
  }

}
