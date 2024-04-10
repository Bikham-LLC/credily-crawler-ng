import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { ProviderAttachmentDTO } from 'src/app/models/ProviderAttachmentDto';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-ocr-report',
  templateUrl: './ocr-report.component.html',
  styleUrls: ['./ocr-report.component.css']
})
export class OcrReportComponent implements OnInit {

  providerSearch = new Subject<string>();
  constructor(private reportService: ReportService) { 

    this.providerSearch.pipe(
      debounceTime(600))
      .subscribe(value => {
        this.databaseHelper.currentPage = 1;
      });

  }

  ngOnInit(): void {
    this.getOcrProviderAttachment();

  }


  version: string='V3';
  getAttachmentWithVersion(version: string){
    this.version = version;
    this.getOcrProviderAttachment();
  }



  selected : { startDate: moment.Moment, endDate: moment.Moment } = {startDate:moment().subtract(30, 'days'), endDate: moment()};
  startDate: any = new Date(this.selected.startDate.toDate()).toDateString();
  endDate: any = new Date(this.selected.endDate.toDate()).toDateString();
  databaseHelper: DatabaseHelper = new DatabaseHelper();
  providerLoadingToggle:boolean = false;
  providerAttachmentList: ProviderAttachmentDTO[] = [];
  totalProviderAttachment: number = 0;
  getOcrProviderAttachment(){
    this.providerAttachmentList = [];
    this.providerLoadingToggle = true;
    this.reportService.getOcrProviderAttachment(this.version, this.startDate, this.endDate, this.databaseHelper).subscribe(response=>{
      if(response != null){
        this.providerAttachmentList = response.list;
        this.totalProviderAttachment = response.totalItems;
      }
      this.providerLoadingToggle = false;
    },error=>{
      this.providerLoadingToggle = false;
    })
  }

  pageChange(event:any){
    this.databaseHelper.currentPage = event;
    this.getOcrProviderAttachment();
  }

}
