import { Component, OnInit } from '@angular/core';
import { ReportService } from '../services/report.service';
import { DatabaseHelper } from '../models/DatabaseHelper';
import { ProviderReport } from '../models/ProviderReport';

@Component({
  selector: 'app-provider-report',
  templateUrl: './provider-report.component.html',
  styleUrls: ['./provider-report.component.css']
})
export class ProviderReportComponent implements OnInit {

  constructor( private reportService:ReportService) { }

  ngOnInit(): void {
    this.getProviderReport();
  }

  databaseHelper:DatabaseHelper = new DatabaseHelper();
  providerReports:ProviderReport[] = new Array();
  totalProviderReport:number=0;
  fetchingReport:boolean=false;
  getProviderReport(){
    this.fetchingReport = true;
    this.reportService.getProviderReport(this.databaseHelper).subscribe(response => {
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
