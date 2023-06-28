import { Component, OnInit } from '@angular/core';
import { ReportService } from '../services/report.service';
import { DatabaseHelper } from '../models/DatabaseHelper';
import { ProviderReport } from '../models/ProviderReport';
import * as moment from 'moment';

@Component({
  selector: 'app-provider-report',
  templateUrl: './provider-report.component.html',
  styleUrls: ['./provider-report.component.css']
})
export class ProviderReportComponent implements OnInit {

  maxDate:any;
  selected !: { startDate: moment.Moment, endDate: moment.Moment };
  startDate: any = null;
  endDate: any = null;
  requestStatusJson:string[]=['IN QUEUE', 'IN PROCESS', 'COMPLETED', 'NO CONFIG', 'AWAIT QUEUE'];

  dropdownSettingsStatus !: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
  selectedStatus: any[] = new Array();
  statusList: any[] = new Array();

  constructor( private reportService:ReportService) { }

  ngOnInit(): void {

    this.dropdownSettingsStatus = {
      singleSelection: true,
      text: 'Select Status',
      enableSearchFilter: false,
      autoPosition: false
    }

    this.getProviderReport();
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

}
