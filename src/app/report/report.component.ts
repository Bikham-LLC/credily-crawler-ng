import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LookupConfiguration } from '../models/LookupConfiguration';
import { DatabaseHelper } from '../models/DatabaseHelper';
import { DataService } from '../services/data.service';
import { Constant } from '../models/Constant';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ReportService } from '../services/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  readonly Constant = Constant;
  constructor(private reportService: ReportService,
    private dataService: DataService) { }
   
    dropdownSettingsVersion !: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
    selectedVersion: any[] = new Array();
    versionList: any[] = new Array();  
    versionJson:string[]=['V2', 'V3'];  
  
    dropdownSettingsStatus !: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
    selectedStatus: any[] = new Array();
    statusList: any[] = new Array();  
    statusJson:string[]=['Test pass', 'Test fail'];
  
    maxDate:any;
    selected !: { startDate: moment.Moment, endDate: moment.Moment };
    startDate: any = null;
    endDate: any = null;        


  ngOnInit(): void {

    this.dropdownSettingsStatus = {
      singleSelection: true,
      text: 'Select Status',
      enableSearchFilter: false,
      autoPosition: false
    }
    this.dropdownSettingsVersion = {
      singleSelection: true,
      text: 'Select Version',
      enableSearchFilter: false,
      autoPosition: false
    }

    // this.getConfigReport();
    this.getStatus();
    this.getVersion();
  }

  providerReport:string='provider';
  lookupConfigReport:string='lookupConfig';
  
  selectedTab:string=this.providerReport;
  switchTab(tab:string){
    this.selectedTab = tab;
  }
  loadingConfigReport: boolean = false;
  configList: LookupConfiguration[] = new Array();
  totalConfiguration: number = 0;
  configDatabaseHelper: DatabaseHelper = new DatabaseHelper();
  getConfigReport() {
    this.loadingConfigReport = true;
    this.reportService.getConfigReport(this.configDatabaseHelper, this.startDate, this.endDate, this.reportStatus).subscribe(response => {
      if (response.status && response.object != null) {
        this.configList = response.object;
        this.totalConfiguration = response.totalItems;
      }
      this.loadingConfigReport = false;
    }, error => {
      this.loadingConfigReport = false;
      this.dataService.showToast(error.error);
    })
  }

  configPageChanged(event: any) {
    if (event != this.configDatabaseHelper.currentPage) {
      this.configDatabaseHelper.currentPage = event;
      this.getConfigReport();
    }
  }

  getStatus(){
    this.statusList = [];
    this.statusJson.forEach(e=>{
      var temp: { id: any, itemName: any} = { id: e, itemName: e };
      this.statusList.push(temp);
    })
    this.statusList = JSON.parse(JSON.stringify(this.statusList));
  }

  reportStatus:string= '';
  selectStatus(event: any) {
    debugger
    this.reportStatus = '';
    if (event[0] != undefined) {
      this.selectedStatus = event;
      this.reportStatus = event[0].id;
    }
    this.getConfigReport();
  }

  getVersion(){
    this.versionList = [];
    this.versionJson.forEach(e=>{
      var temp: { id: any, itemName: any} = { id: e, itemName: e };
      this.versionList.push(temp);
    })
    this.versionList = JSON.parse(JSON.stringify(this.versionList));
  }

  version:string= '';
  selectVersion(event: any) {
    debugger
    this.version = '';
    if (event[0] != undefined) {
      this.selectedVersion = event;
      this.version = event[0].id;
    }
    this.getConfigReport();
  }

  selectDateFilter(event: any) {
    debugger
    if (this.selected != undefined && this.selected != null && this.selected.startDate != undefined && this.selected.endDate != undefined && this.selected != null) {
      this.startDate = new Date(this.selected.startDate.toDate()).toDateString();
      this.endDate = new Date(this.selected.endDate.toDate()).toDateString();
    }
    this.getConfigReport();

  }

  ids:number[] = new Array();
  selectIdForTest(config:any){
    config.toggle=false;
    var i = this.ids.findIndex(e=>e==config.id);
    if(i > -1){
      this.ids.splice(i,1);
    } else {
      if(this.ids.length<2){
        
        this.ids.push(config.id);
        config.toggle=true;
      }
      
    }
    
    // console.log(this.ids);
    // console.log(this.checkcheck(config.id));
  }


  checkcheck(id:any){
    
    if(this.ids.includes(id)){
      return true;
    }else{
      return false;
    }
  }


  testingConfigToggle:boolean = false;
  testConfig(){
    this.testingConfigToggle = true;
    this.reportService.idToTestConfig(this.ids).subscribe(response=>{
    if(response.status){
      this.ids = [];
    }
    this.testingConfigToggle = false;
    this.getConfigReport();
    }, error=>{
      this.testingConfigToggle = false;
    })
  }


  selectedImage: string ='';
  @ViewChild('openSnapshotModalButton') openSnapshotModalButton! : ElementRef;
  showSnapshot(url:string){
    debugger
    this.selectedImage = url;
    this.closeViewModalButton.nativeElement.click();
    this.openSnapshotModalButton.nativeElement.click();
    // setTimeout(()=>{
    //   this.openSnapshotModalButton.nativeElement.click();
    // },2000)
  }
  
  @ViewChild('closeImageModalButton') closeImageModalButton! : ElementRef;
  closeImageModal(){
    this.closeImageModalButton.nativeElement.click();
    this.selectedImage='';
    this.viewModalButton.nativeElement.click(); 
  }
  
  @ViewChild('viewModalButton') viewModalButton! : ElementRef;
  viewMultiple(id:number){
    this.viewModalButton.nativeElement.click(); 
    this.getScreenshot(id);
  }
  @ViewChild('closeViewModalButton') closeViewModalButton! : ElementRef;
  closeViewModel(){
    this.closeViewModalButton.nativeElement.click();
  }

  configSnapshotList:any[] = new Array();
  shapshotLoadingToggle:boolean = false;
  getScreenshot(id:number){
    this.shapshotLoadingToggle = true;
    this.reportService.getScreenshot(id).subscribe(response=>{
      this.configSnapshotList = response;
      this.shapshotLoadingToggle = false;
    }, error=>{
      this.shapshotLoadingToggle = false;
    })
  }
}
