import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { FailedConfigDTO } from 'src/app/models/FailedConfigDTO';
import { MappedConfiguraion } from 'src/app/models/MappedConfiguraion';
import { DataService } from 'src/app/services/data.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-noconfig-found-report',
  templateUrl: './noconfig-found-report.component.html',
  styleUrls: ['./noconfig-found-report.component.css']
})
export class NoconfigFoundReportComponent implements OnInit {


  dropdownSettingsVersion!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean, badgeShowLimit: number; };
  versionList: any[] = [{id:'V2', itemName:'V2'}, {id:'V3', itemName:'V3'}];
  selectedVersion: any[] = new Array();

  dropdownSettingsState!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean, badgeShowLimit: number; };
  stateList: any[] = new Array();
  selectedState: any[] = new Array();

  providerSearch = new Subject<string>();
  constructor(private reportService: ReportService,
    private dataService: DataService) { 

    this.providerSearch.pipe(
      debounceTime(600))
      .subscribe(value => {
        this.databaseHelper.currentPage = 1;
        this.getNoConfigFoundReport();
      });

  }

  ngOnInit(): void {
    this.dropdownSettingsVersion = {
      singleSelection: true,
      text: 'Select Version',
      enableSearchFilter: false,
      autoPosition: false,
      badgeShowLimit: 1
    };

    this.dropdownSettingsState = {
      singleSelection: false,
      text: 'Select State',
      enableSearchFilter: true,
      autoPosition: false,
      badgeShowLimit: 1
    };

    this.getStates();
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
    this.getNoConfigFoundReport();
  }

  versionFilterToggle:boolean = false;
  filterByVersion(){
    this.versionFilterToggle = !this.versionFilterToggle;
  }

  selectVersion(event:any){
    debugger
    this.version = '';
    if(event != undefined && event.length > 0){
      this.version = event[0].id;
    }
    this.getNoConfigFoundReport();
    this.versionFilterToggle = false
  }


  version : string='';
  databaseHelper: DatabaseHelper = new DatabaseHelper();
  noConfigFoundList: FailedConfigDTO[] = [];
  totalItems:number = 0;
  noConfigLoadingToggle:boolean = false;
  getNoConfigFoundReport(){
    this.noConfigLoadingToggle = true;
    this.reportService.getNoConfigFoundReport(this.startDate, this.endDate, this.databaseHelper, this.version, this.states).subscribe(response=>{
      if(response != null){
        this.noConfigFoundList = response.list;
        this.totalItems = response.totalItems;
      }
      this.noConfigLoadingToggle = false;
    },error=>{
      this.noConfigLoadingToggle = false;
    })
  }

  pageChanged(event:any){
    this.databaseHelper.currentPage = event;
    this.getNoConfigFoundReport();
  }

  @ViewChild('viewConfigModalButton') viewConfigModalButton!: ElementRef
  @ViewChild('closeConfigModalButton') closeConfigModalButton!: ElementRef
  mappedConfiguraionList : MappedConfiguraion[] = new Array();
  mappedConfigLoadingToggle:boolean = false;
  logId:number=0;
  getMappedConfiguration(logId:number){
    debugger
    this.logId = 0;
    this.logId = logId;
    this.mappedConfigLoadingToggle =true;
    this.viewConfigModalButton.nativeElement.click();
    this.reportService.getMappedConfiguration(logId).subscribe(response=>{
      if(response != null){
        this.mappedConfiguraionList = response;
      }
      this.mappedConfigLoadingToggle = false;
    },error=>{
      this.mappedConfigLoadingToggle = false;
    })
  }


  runConfigLoadingToggle:boolean = false;
  runMappedConfiguration(configId:number, index:number){
    debugger
    this.runConfigLoadingToggle = true;
    this.mappedConfiguraionList[index].runConfigLoadingToggle = true;
    this.reportService.runMappedConfiguration(configId, this.logId).subscribe(response=>{
      this.mappedConfiguraionList[index].runConfigLoadingToggle = false;
      this.runConfigLoadingToggle = false;
      setTimeout(() => {
        this.closeConfigModalButton.nativeElement.click();
        this.dataService.showToast(response.message);
      }, 300);
      this.getNoConfigFoundReport();
    },error=>{
      this.runConfigLoadingToggle = false;
      this.mappedConfiguraionList[index].runConfigLoadingToggle = false;
    })
  }


  getStates(){
    this.reportService.getReportState('noConfigFound').subscribe(response=>{
      if(response != null){
        this.stateList = response;
      }
    },error=>{

    })
  }

  stateFilterToggle:boolean = false;
  filterByState(){
    this.stateFilterToggle = !this.stateFilterToggle;
  }

  states:string[] = []
  selectState(event:any){
    debugger
    this.states = [];
    if(event != undefined && event.length > 0){
      event.forEach((element:any) => {
        this.states.push(element.itemName);
      });
    }
    this.getNoConfigFoundReport();
    this.stateFilterToggle = false;
  }

}
