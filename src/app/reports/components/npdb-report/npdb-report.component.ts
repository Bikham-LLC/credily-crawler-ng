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
  selector: 'app-npdb-report',
  templateUrl: './npdb-report.component.html',
  styleUrls: ['./npdb-report.component.css']
})
export class NpdbReportComponent implements OnInit {

  readonly Route = Route;
  readonly Constant = Constant;
  isHeaderServiceCall: boolean = false;

  constructor(private reportService : ReportService,
    private dataService: DataService,
    private router : Router,
    private headerSubscriptionService: HeaderSubscriptionService) { 

      this.providerSearch.pipe(
        debounceTime(600))
        .subscribe(value => {
          this.databaseHelper.currentPage = 1;
          this.getProviderReport();
        });
  
        this.subscribeHeader = this.headerSubscriptionService.headerVisibilityChange.subscribe(async (value) => {
          debugger
          if(router.url == Route.NPDB_REPORT){
            if(!this.isHeaderServiceCall){
              this.getProviderReport();
            }
            this.isHeaderServiceCall = false;
          }
        })
    }

  ngOnInit(): void {
    if(!this.isHeaderServiceCall){
      this.isHeaderServiceCall = true;
      this.getProviderReport()
    }
  }

  ngOnDestroy(){
    this.subscribeHeader.complete();
  }

  subscribeHeader:any;
  

  providerSearch = new Subject<string>();
  totalProviders:number = 0;
  databaseHelper: DatabaseHelper = new DatabaseHelper();
  providerList: RpaReportDTO[] = new Array();
  reportLoadingToggle:boolean = false;


  getProviderReport(){
    this.reportLoadingToggle = true;
    this.reportService.getNpdbReport(this.databaseHelper, this.dataService.startDate, this.dataService.endDate, this.dataService.isLiveAccount).subscribe(response=>{
      if(response.status){
        this.providerList = response.object;
        this.totalProviders = response.totalItems;
      }

      this.reportLoadingToggle = false;
    },error=>{
      this.reportLoadingToggle = false;
    })
  }


  pageChanged(event:any){
    this.databaseHelper.currentPage = event;
    this.getProviderReport();
  }

  imageUrl:string='';
  imageLoadingToggle:boolean = false;
  @ViewChild('openSnapshotModalButton') openSnapshotModalButton!: ElementRef
  openImage(url:string){
    this.imageLoadingToggle = true;
    this.openSnapshotModalButton.nativeElement.click();
    this.imageUrl = url;
    this.imageExtension = this.getFileExtension(url);
    setTimeout(() => {
      this.imageLoadingToggle = false;
    }, 1000);
  }

  imageExtension:string='';
  getFileExtension(url: string): string {
    const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return match ? match[1] : '';
  }

}
