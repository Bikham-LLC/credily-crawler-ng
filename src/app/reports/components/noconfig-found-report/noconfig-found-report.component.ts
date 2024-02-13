import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-noconfig-found-report',
  templateUrl: './noconfig-found-report.component.html',
  styleUrls: ['./noconfig-found-report.component.css']
})
export class NoconfigFoundReportComponent implements OnInit {

  constructor(private reportService: ReportService) { }

  ngOnInit(): void {

    this.getNoConfigFoundReport();
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
  }


  searchFilter : string='';
  databaseHelper: DatabaseHelper = new DatabaseHelper();
  getNoConfigFoundReport(){
    this.startDate = new Date(this.selected.startDate.toDate()).toDateString();
    this.endDate = new Date(this.selected.endDate.toDate()).toDateString();
    this.reportService.getNoConfigFoundReport(this.startDate, this.endDate, this.databaseHelper, this.searchFilter).subscribe(response=>{

    })
  }
}
