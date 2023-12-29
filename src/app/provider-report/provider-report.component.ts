import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../services/report.service';
import { DatabaseHelper } from '../models/DatabaseHelper';
import { ProviderReport } from '../models/ProviderReport';
import * as moment from 'moment';
import { ProviderRequestCrawlerLog } from '../models/ProviderRequestCrawlerLog';
import { Constant } from '../models/Constant';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-provider-report',
  templateUrl: './provider-report.component.html',
  styleUrls: ['./provider-report.component.css']
})
export class ProviderReportComponent implements OnInit {

  readonly Constant = Constant;
  maxDate:any;
  selected !: { startDate: moment.Moment, endDate: moment.Moment };
  startDate: any = null;
  endDate: any = null;
  requestStatusJson:string[]=['IN QUEUE', 'IN PROCESS', 'COMPLETED', 'NO CONFIG', 'AWAIT QUEUE'];

  dropdownSettingsStatus !: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
  selectedStatus: any[] = new Array();
  statusList: any[] = new Array();

  providerSearch = new Subject<string>();
  constructor( private reportService:ReportService) { 

    this.providerSearch.pipe(
      debounceTime(600))
      .subscribe(value => {
        this.databaseHelper.currentPage = 1;
        this.getProviderReport();
      });
  }

  ngOnInit(): void {

    this.dropdownSettingsStatus = {
      singleSelection: true,
      text: 'Select Status',
      enableSearchFilter: false,
      autoPosition: false
    }
    this.getStatus();
  }

  databaseHelper:DatabaseHelper = new DatabaseHelper();
  providerReports:ProviderReport[] = new Array();
  totalProviderReport:number=0;
  fetchingReport:boolean=false;
  status:string='';

  getStatus(){
    this.statusList = [];
    this.requestStatusJson.forEach(e=>{
      var temp: { id: any, itemName: any} = { id: e, itemName: e };
      this.statusList.push(temp);
    })
    this.statusList = JSON.parse(JSON.stringify(this.statusList));
  }

  selectDateFilter(event: any) {
    debugger
    if (this.selected != undefined && this.selected != null && this.selected.startDate != undefined && this.selected.endDate != undefined && this.selected != null) {
      this.startDate = new Date(this.selected.startDate.toDate()).toDateString();
      this.endDate = new Date(this.selected.endDate.toDate()).toDateString();
    }
    this.getProviderReport();

  }
  selectVersion(event: any) {
    debugger
    this.status = '';
    if (event[0] != undefined) {
      this.selectedStatus = event;
      this.status = event[0].id;
    }
    this.getProviderReport();
  }

  getProviderReport(){
    this.fetchingReport = true;
    this.reportService.getProviderReport(this.databaseHelper, this.status, this.startDate, this.endDate).subscribe(response => {
      if(response!=null){
        this.providerReports = response.object;
        this.totalProviderReport = response.totalItems;
      }
      this.fetchingReport = false;
    }, error => {
      this.fetchingReport = false;
    })
  }

  pageChanged(event:any){
    this.databaseHelper.currentPage = event;
    this.getProviderReport();
  }

  @ViewChild('viewLogsButton') viewLogsButton!: ElementRef;
  uuid :any;
  viewLogs(providerUuid:string){
    this.uuid = providerUuid;
    this.viewLogsButton.nativeElement.click();
    this.getProviderLogs(this.uuid);
  }

  providerCrawlerLogList:ProviderRequestCrawlerLog[]=new Array();
  logLoadingToggle:boolean = false;
  getProviderLogs(providerUuid:string){
    this.logLoadingToggle = true;
    this.reportService.getProviderLogs(providerUuid).subscribe(response=>{
      this.providerCrawlerLogList = response;
      this.logLoadingToggle = false;
    },error=>{
      this.logLoadingToggle = false;
    })
  }

  providerTestingToggle:boolean = false;
  testAgainProviderRequest(logId:number, index:number){
    this.providerTestingToggle = true;
    this.providerCrawlerLogList[index].reTestingToggle = true;
    this.reportService.testAgainProviderRequest(logId).subscribe(response=>{
      this.providerCrawlerLogList[index].reTestingToggle = false;
      this.providerTestingToggle = false;
      this.getProviderLogs(this.uuid);
    },error=>{
      this.providerTestingToggle = false;
      this.providerCrawlerLogList[index].reTestingToggle = false;
    })
  }

  @ViewChild('closeLogsButton') closeLogsButton!:ElementRef;
  closeLogModel(){
    this.closeLogsButton.nativeElement.click();
  }
  
  @ViewChild('openSnapshotModalButton') openSnapshotModalButton !: ElementRef;
  imageUrl:string='';
  viewSnapshot(url:string){
    debugger
    this.imageUrl = url;
    this.closeLogsButton.nativeElement.click();
    this.openSnapshotModalButton.nativeElement.click();
  }

  @ViewChild('closeSnapshotModalButton') closeSnapshotModalButton !: ElementRef;
  closeSnapshotModal(){
    this.closeSnapshotModalButton.nativeElement.click();
    this.viewLogsButton.nativeElement.click();
  }

  refreshProviderStatus(providerUuid:string, index:number){
    debugger
    this.providerReports[index].refreshProviderLoading = true;
    this.reportService.refreshProviderStatus(providerUuid).subscribe(response=>{
      this.providerReports[index].status = response.object;
      this.providerReports[index].refreshProviderLoading = false;
    },error=>{
      this.providerReports[index].refreshProviderLoading = false;
    })
  }

  refreshProviderLogs(){
    this.getProviderLogs(this.uuid);
  }

}
