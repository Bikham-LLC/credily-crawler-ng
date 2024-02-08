import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CommentRequest } from 'src/app/models/CommentRequest';
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
    // this.getFailedConfigs(this.searchFilter);
    // this.getFailedConfigsCount();
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

  
  selected : { startDate: moment.Moment, endDate: moment.Moment } = {startDate:moment().subtract(30, 'days'), endDate: moment()};
  startDate: any = null;
  endDate: any = null;
  selectDateFilter(event: any) {
    debugger
    if (this.selected != undefined && this.selected != null && this.selected.startDate != undefined && this.selected.endDate != undefined && this.selected != null) {
      this.startDate = new Date(this.selected.startDate.toDate()).toDateString();
      this.endDate = new Date(this.selected.endDate.toDate()).toDateString();
    } else {
      this.selected = {startDate:moment().subtract(30, 'days'), endDate: moment()};
      return;
    }
    this.getFailedConfigs(this.searchFilter);
    this.getFailedConfigsCount();
  }

  searchFilter:string ='';
  configLoadingToggle:boolean = false;
  databaseHelper: DatabaseHelper = new DatabaseHelper();
  failedConfigList : FailedConfigDTO[] = new Array();
  totalConfigsCount:number=0;
  getFailedConfigs(searchFilter:string){
    this.configLoadingToggle = true;
    this.searchFilter = searchFilter;
    this.reportService.getFailedConfigs(this.startDate, this.endDate, this.databaseHelper, this.searchFilter).subscribe(response=>{
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

  @ViewChild('completeModalButton') completeModalButton !: ElementRef;
  comment:string='';
  openCommentModal(obj:FailedConfigDTO){
    this.comment = '';
    this.commentRequest.configLink = obj.configLink;
    this.commentRequest.configName = obj.configName;
    this.commentRequest.logId = obj.id;
    this.completeModalButton.nativeElement.click();
  }
  
  @ViewChild('closeCommentModalButton') closeCommentModalButton !: ElementRef;
  closeCommentModal(){
    this.closeCommentModalButton.nativeElement.click();
  }

  commentRequest:CommentRequest = new CommentRequest();
  commentSavingToggle:boolean = false;
  currentTime: any = moment().format('Do MMM YYYY, h:mm a');
  createConfigComment(){
    debugger
    this.commentSavingToggle = true;
    this.commentRequest.comment = this.comment;
    this.reportService.createConfigComment(this.commentRequest).subscribe(response=>{
      if(response){
        this.closeCommentModal();
      }
      this.commentSavingToggle = false;
    },error=>{
      this.commentSavingToggle = false;
    })
  }

}
