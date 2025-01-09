import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ApplicationFollowupDTO } from 'src/app/models/ApplicationFollowupDTO';
import { Constant } from 'src/app/models/Constant';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { Route } from 'src/app/models/Route';
import { RpaReportDTO } from 'src/app/models/RpaReportDTO';
import { DataService } from 'src/app/services/data.service';
import { HeaderSubscriptionService } from 'src/app/services/header-subscription.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-follow-up-report',
  templateUrl: './follow-up-report.component.html',
  styleUrls: ['./follow-up-report.component.css']
})
export class FollowUpReportComponent implements OnInit {

 
  readonly Route = Route;
  readonly Constant = Constant;

  constructor(private reportService : ReportService,
    private dataService: DataService,
    private router : Router,
    private headerSubscriptionService: HeaderSubscriptionService) { 

      this.providerSearch.pipe(
        debounceTime(600))
        .subscribe(value => {
          this.databaseHelper.currentPage = 1;
          this.getFollowUpReport();
        });
  
        this.subscribeHeader = this.headerSubscriptionService.headerVisibilityChange.subscribe(async (value) => {
          debugger
          if(router.url == Route.FOLLOW_UP_REPORT){
            this.getFollowUpReport();
          }
        })
    }

  ngOnInit(): void {
    this.getFollowUpReport()
  }

  subscribeHeader:any;
  

  providerSearch = new Subject<string>();
  totalProviders:number = 0;
  databaseHelper: DatabaseHelper = new DatabaseHelper();
  followupList: ApplicationFollowupDTO[] = new Array();
  reportLoadingToggle:boolean = false;


  getFollowUpReport(){
    this.reportLoadingToggle = true;
    this.reportService.getFollowUpReport(this.databaseHelper, this.dataService.startDate, this.dataService.endDate).subscribe(response=>{
      if(response.status){
        this.followupList = response.object;
        this.totalProviders = response.totalItems;
      }

      this.reportLoadingToggle = false;
    },error=>{
      this.reportLoadingToggle = false;
    })
  }

  pageChange(event:any){
    this.databaseHelper.currentPage = event;
    this.getFollowUpReport();
  }

  imageUrl:string='';
  imageLoadingToggle:boolean = false;
  @ViewChild('openSnapshotModalButton') openSnapshotModalButton!: ElementRef
  openImage(url:string){
    this.imageLoadingToggle = true;
    this.openSnapshotModalButton.nativeElement.click();
    this.imageUrl = url;
    setTimeout(() => {
      this.imageLoadingToggle = false;
    }, 1000);
  }

}
