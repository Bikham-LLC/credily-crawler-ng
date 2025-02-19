import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { ProviderAttachmentDTO } from 'src/app/models/ProviderAttachmentDTO';
import { Route } from 'src/app/models/Route';
import { DataService } from 'src/app/services/data.service';
import { HeaderSubscriptionService } from 'src/app/services/header-subscription.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-ocr-report',
  templateUrl: './ocr-report.component.html',
  styleUrls: ['./ocr-report.component.css']
})
export class OcrReportComponent implements OnInit {

  providerSearch = new Subject<string>();
  constructor(private reportService: ReportService,
    private dataService: DataService,
    private headerSubscriptionService: HeaderSubscriptionService,
    private router: Router) { 

      this.subscribeHeader = this.headerSubscriptionService.headerVisibilityChange.subscribe(async (value) => {
        debugger
        if(router.url == Route.OCR_REPORT){
          this.getOcrProviderAttachment();
        }
      });

    this.providerSearch.pipe(
      debounceTime(600))
      .subscribe(value => {
        this.databaseHelper.currentPage = 1;
        this.getOcrProviderAttachment();
      });

    }

  ngOnInit(): void {
    this.getOcrProviderAttachment();
  }

  readonly Route = Route;
  subscribeHeader:any;
  
  version: string='V3';
  getAttachmentWithVersion(version: string){
    this.version = version;
    this.getOcrProviderAttachment();
  }

  databaseHelper: DatabaseHelper = new DatabaseHelper();
  providerLoadingToggle:boolean = false;
  providerAttachmentList: ProviderAttachmentDTO[] = [];
  totalProviderAttachment: number = 0;
  getOcrProviderAttachment(){
    this.providerAttachmentList = [];
    this.providerLoadingToggle = true;
    this.reportService.getOcrProviderAttachment(this.version, this.dataService.startDate, this.dataService.endDate, this.databaseHelper, this.dataService.isLiveAccount, '').subscribe(response=>{
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
    this.reportService.getAttachmentOcrData(this.version, attachmentId, 0, '').subscribe(response=>{
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
    this.imageExtension = this.getFileExtension(imageUrl);
    this.openSnapshotModalButton.nativeElement.click();
    setTimeout(()=>{
      this.imageLoadingToggle =false;
    },1000)
  }
  
  imageExtension:string='';
  getFileExtension(url: string): string {
    const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return match ? match[1] : '';
  }

}
