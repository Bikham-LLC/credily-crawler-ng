import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { ProviderReport } from 'src/app/models/ProviderReport';
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

}
