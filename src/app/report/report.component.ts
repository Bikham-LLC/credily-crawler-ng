import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LookupConfiguration } from '../models/LookupConfiguration';
import { DatabaseHelper } from '../models/DatabaseHelper';
import { LookupTaxonomyService } from '../services/lookup-taxonomy.service';
import { DataService } from '../services/data.service';
import { Constant } from '../models/Constant';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  readonly Constant = Constant;
  constructor(private lookupTaxonomyService: LookupTaxonomyService,
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

    this.getConfiguration();
    this.getStatus();
    this.getVersion();
  }

  providerReport:string='provider';
  lookupConfigReport:string='lookupConfig';
  
  selectedTab:string=this.providerReport;
  switchTab(tab:string){
    this.selectedTab = tab;
  }

  selectedImage: string ='';
  loadingConfiguration: boolean = false;
  configList: LookupConfiguration[] = new Array();
  totalConfiguration: number = 0;
  configDatabaseHelper: DatabaseHelper = new DatabaseHelper();
  getConfiguration() {
    this.loadingConfiguration = true;
    this.lookupTaxonomyService.getConfiguration(this.configDatabaseHelper, this.startDate, this.endDate, this.version, this.reportStatus).subscribe(response => {
      if (response.status && response.object != null) {
        this.configList = response.object;
        this.totalConfiguration = response.totalItems;
      }
      this.loadingConfiguration = false;
    }, error => {
      this.loadingConfiguration = false;
      this.dataService.showToast(error.error);
    })
  }

  configPageChanged(event: any) {
    if (event != this.configDatabaseHelper.currentPage) {
      this.configDatabaseHelper.currentPage = event;
      this.getConfiguration();
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
    this.getConfiguration();
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
    this.getConfiguration();
  }

  selectDateFilter(event: any) {
    debugger
    if (this.selected != undefined && this.selected != null && this.selected.startDate != undefined && this.selected.endDate != undefined && this.selected != null) {
      this.startDate = new Date(this.selected.startDate.toDate()).toDateString();
      this.endDate = new Date(this.selected.endDate.toDate()).toDateString();
    }
    this.getConfiguration();

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
    this.lookupTaxonomyService.idToTestConfig(this.ids).subscribe(response=>{
    if(response.status){
      this.ids = [];
    }
    this.testingConfigToggle = false;
    }, error=>{
      this.testingConfigToggle = false;
    })
  }

}
