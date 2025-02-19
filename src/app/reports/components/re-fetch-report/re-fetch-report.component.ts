import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Constant } from 'src/app/models/Constant';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { ReFetchReportDTO } from 'src/app/models/ReFetchReportDTO';
import { Route } from 'src/app/models/Route';
import { DataService } from 'src/app/services/data.service';
import { HeaderSubscriptionService } from 'src/app/services/header-subscription.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-re-fetch-report',
  templateUrl: './re-fetch-report.component.html',
  styleUrls: ['./re-fetch-report.component.css']
})
export class ReFetchReportComponent implements OnInit {

  readonly Constant = Constant;
  readonly Route = Route;
  isHeaderServiceCall: boolean = false;
  
  providerSearch = new Subject<string>();
  constructor(private reportService: ReportService,
    private dataService: DataService,
    private router : Router,
    private headerSubscriptionService: HeaderSubscriptionService) { 

      this.subscribeHeader = this.headerSubscriptionService.headerVisibilityChange.subscribe(async (value) => {
        debugger
        if(this.router.url == Route.RE_FETCH_REPORT){
          if(!this.isHeaderServiceCall){
            this.getReFetchReport();
          }
          this.isHeaderServiceCall = false;
        }
      })

      this.providerSearch.pipe(
        debounceTime(600))
        .subscribe(value => {
          this.databaseHelper.currentPage = 1;
          this.getReFetchReport();
        });
    }

  subscribeHeader :any;
  
  ngOnInit(): void {
    if(!this.isHeaderServiceCall){
      this.isHeaderServiceCall = true;
      this.getReFetchReport(); 
    }
  }

  ngOnDestroy(){
    this.subscribeHeader.complete();
  }

  databaseHelper:DatabaseHelper = new DatabaseHelper();

  reportList: ReFetchReportDTO[] = new Array();
  totalProviders:number=0;
  reportLoadingToggle:boolean = false;
  getReFetchReport(){
    this.reportLoadingToggle = true;
    this.reportService.getReFetchLicenseReport(this.databaseHelper, this.dataService.startDate, this.dataService.endDate, this.dataService.isLiveAccount).subscribe(response=>{
      if(response.status){
        this.reportList = response.object;
        this.totalProviders = response.totalItems;
      }
      this.reportLoadingToggle = false;
    }, error=>{
      this.reportLoadingToggle = false;
    })
  }

  pageChanged(event:any){
    this.databaseHelper.currentPage = event;
    this.getReFetchReport();
  }

  @ViewChild('openImageModalButton') openImageModalButton!: ElementRef

  imageLoadingToggle:boolean = false;
  imageUrl:string='';
  openImageModal(url:string){
    this.openImageModalButton.nativeElement.click();
    this.imageLoadingToggle = true;
    setTimeout(() => {
      this.imageLoadingToggle = false;
    }, 1000);
    this.imageUrl = url;
    this.imageExtension = this.getFileExtension(url);
  }


  imageExtension:string='';
  getFileExtension(url: string): string {
    const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return match ? match[1] : '';
  }

}
