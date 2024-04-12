import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { ProviderAttachmentDTO } from 'src/app/models/ProviderAttachmentDTO';
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
        this.getOcrProviderAttachment();
      });
    }

  ngOnInit(): void {
    // this.getOcrProviderAttachment();

  }

  version: string='V3';
  getAttachmentWithVersion(version: string){
    this.version = version;
    this.getOcrProviderAttachment();
  }

  selectDateFilter(event: any) {
    debugger
    if (this.selected != undefined && this.selected != null && this.selected.startDate != undefined && this.selected.endDate != undefined && this.selected != null) {
      this.startDate = this.selected.startDate.format('YYYY-MM-DD');
      this.endDate = this.selected.endDate.format('YYYY-MM-DD');
    }
    this.getOcrProviderAttachment();

  }


  selected : { startDate: moment.Moment, endDate: moment.Moment } = {startDate:moment().subtract(30, 'days'), endDate: moment()};
  startDate: any = null;
  endDate: any = null;
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

  ocrDataLoadingToggle:boolean = false;
  keys : any[]  = new Array();
  myMap: any;
  getAttachmentOcrData(attachmentId:number){
    debugger
    this.keys = [];
    this.ocrDataLoadingToggle = true;
    this.reportService.getAttachmentOcrData(this.version, attachmentId).subscribe(response=>{
      if(response!=null){
        this.myMap = response;
        Object.keys(response).forEach(element => {
          this.keys.push(element);
        });
      }
      this.ocrDataLoadingToggle = false;
    },error=>{
      this.ocrDataLoadingToggle = false;
    })
  }

  @ViewChild('showOcrDataModalButton') showOcrDataModalButton!:ElementRef
  openOcrDataModal(attachmentId:number){
    this.getAttachmentOcrData(attachmentId);
    this.showOcrDataModalButton.nativeElement.click();
  }
  
  @ViewChild('openSnapshotModalButton') openSnapshotModalButton!:ElementRef
  imageUrl:string='';
  imageLoadingToggle:boolean =false;
  openImageModal(imageUrl:string){
    this.imageLoadingToggle =true;
    this.imageUrl = imageUrl;
    this.openSnapshotModalButton.nativeElement.click();
    setTimeout(()=>{
      this.imageLoadingToggle =false;
    },1000)
  }
  

}
