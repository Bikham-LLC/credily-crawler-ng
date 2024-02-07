import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Constant } from 'src/app/models/Constant';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { FailedConfigDTO } from 'src/app/models/FailedConfigDTO';
import { ProviderRequestCrawlerLog } from 'src/app/models/ProviderRequestCrawlerLog';
import { Route } from 'src/app/models/Route';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-failed-config-report',
  templateUrl: './failed-config-report.component.html',
  styleUrls: ['./failed-config-report.component.css']
})
export class FailedConfigReportComponent implements OnInit {

  readonly Route = Route;
  readonly Constant = Constant;

  providerSearch = new Subject<string>();
  constructor(private reportService : ReportService,
    private router : Router) { 

      this.providerSearch.pipe(
      debounceTime(600))
      .subscribe(value => {
        this.databaseHelper.currentPage = 1;
        this.getFailedConfigs(this.searchFilter);
      });
    }

  ngOnInit(): void {
    this.getFailedConfigs(this.searchFilter);
    this.getFailedConfigsCount();
  }

  reRunSucessful:number =0;
  reRunFailed:number =0;
  reRunPending:number =0;
  getFailedConfigsCount(){
    this.reportService.getFailedConfigsCount().subscribe(response=>{
      if(response != null){
        this.reRunSucessful = response.reRunSucessful;
        this.reRunFailed = response.reRunFailed;
        this.reRunPending = response.reRunPending;
      }
    },error=>{

    })
  }

  searchFilter:string ='';
  configLoadingToggle:boolean = false;
  databaseHelper: DatabaseHelper = new DatabaseHelper();
  failedConfigList : FailedConfigDTO[] = new Array();
  totalConfigsCount:number=0;
  getFailedConfigs(searchFilter:string){
    this.configLoadingToggle = true;
    this.searchFilter = searchFilter;
    this.reportService.getFailedConfigs(this.databaseHelper, this.searchFilter).subscribe(response=>{
      if(response != null){
        this.failedConfigList = response.list;
        this.totalConfigsCount = response.totalItems;
      }
      this.configLoadingToggle = false;
    },error=>{
      this.configLoadingToggle = false;
    })
  }

  pageChanged(event:any){
    this.databaseHelper.currentPage = event;
    this.getFailedConfigs(this.searchFilter);
  }

  routeToConfiguration(lookupName: string, lookupLink:string){
    this.reportService.getConfigId(lookupName, lookupLink).subscribe(response=>{
      if(response != null){
        let navigateExtra : NavigationExtras = {
          queryParams : {"id" : response},
        };
        this.router.navigate([this.Route.CONFIGURATION_ROUTE], navigateExtra)
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
  viewSnapshot(url:string){
    debugger
    this.imageUrl = url;
    setTimeout(() => {
      this.openSnapshotModalButton.nativeElement.click();
    }, 100);
  }

}
