import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Constant } from 'src/app/models/Constant';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { FailedConfigDTO } from 'src/app/models/FailedConfigDTO';
import { MappedConfiguraion } from 'src/app/models/MappedConfiguraion';
import { NoConfigProvider } from 'src/app/models/NoConfigProvider';
import { Route } from 'src/app/models/Route';
import { DataService } from 'src/app/services/data.service';
import { HeaderSubscriptionService } from 'src/app/services/header-subscription.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-noconfig-found-report',
  templateUrl: './noconfig-found-report.component.html',
  styleUrls: ['./noconfig-found-report.component.css']
})
export class NoconfigFoundReportComponent implements OnInit {

  readonly Constant = Constant;

  dropdownSettingsVersion!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean, badgeShowLimit: number; };
  versionList: any[] = [{id:'V2', itemName:'V2'}, {id:'V3', itemName:'V3'}];
  selectedVersion: any[] = new Array();

  dropdownSettingsState!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean, badgeShowLimit: number; };
  stateList: any[] = new Array();
  selectedState: any[] = new Array();

  dropdownSettingsConfig!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean, badgeShowLimit: number;};
  configList: any[] = new Array();
  selectedConfig: any[] = new Array();

  dropdownSettingsTaxonomy!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean, badgeShowLimit: number;};
  taxonomyList: any[] = new Array();
  selectedTaxonomy: any[] = new Array();
  
  dropdownSettingsBoardName!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean, badgeShowLimit: number;};
  boardList: any[] = new Array();
  selectedBoard: any[] = new Array();

  dropdownSettingsBoardConfigName!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean, badgeShowLimit: number;};
  boardConfigList: any[] = new Array();
  selectedBoardConfig: any[] = new Array();

  providerSearch = new Subject<string>();
  constructor(private reportService: ReportService,
    private dataService: DataService,
    private headerSubscriptionService : HeaderSubscriptionService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { 
      this.subscribeHeader = this.headerSubscriptionService.headerVisibilityChange.subscribe(async (value) => {
        debugger
        if(router.url == Route.NO_CONFIG_FOUND_REPORT){
          this.getNoConfigFoundReport();
          this.getBoardConfigName();
        }
      })

      if (this.activatedRoute.snapshot.queryParamMap.has('version')) {
        this.routeVersion = this.activatedRoute.snapshot.queryParamMap.get('version');
      }

      this.providerSearch.pipe(
        debounceTime(600))
        .subscribe(value => {
          this.databaseHelper.currentPage = 1;
          this.getNoConfigFoundReport();
      });

      if(this.routeVersion != null){
        this.selectedVersion = [];
        this.versionFilterToggle = true;
        this.version = this.routeVersion;
        var temp : {id:any, itemName: any} = {id: this.routeVersion, itemName : this.routeVersion};
        this.selectedVersion.push(temp);
      }
    }

  routeVersion:any;
  
  subscribeHeader:any;
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
      badgeShowLimit: 1,
    };

    this.dropdownSettingsConfig = {
      singleSelection: true,
      text: 'Select Configuration',
      enableSearchFilter: true,
      autoPosition: false,
      badgeShowLimit: 1,
    };

    this.dropdownSettingsTaxonomy = {
      singleSelection: true,
      text: 'Select Taxonomy',
      enableSearchFilter: true,
      autoPosition: false,
      badgeShowLimit: 1,
    };

    this.dropdownSettingsBoardName = {
      singleSelection: false,
      text: 'Select Board',
      enableSearchFilter: true,
      autoPosition: false,
      badgeShowLimit: 1,
    };

    this.dropdownSettingsBoardConfigName = {
      singleSelection: true,
      text: 'Select Board',
      enableSearchFilter: true,
      autoPosition: false,
      badgeShowLimit: 1,
    };

    this.getNoConfigFoundReport();
    this.getBoardConfigName();
    this.getStates();
  }

  versionFilterToggle:boolean = false;
  filterByVersion(){
    this.versionFilterToggle = !this.versionFilterToggle;
  }


  selectVersion(event:any){
    debugger
    this.version = '';
    this.selectedVersion = [];
    if(event != undefined && event.length > 0){
      this.version = event[0].id;
      var temp : {id:any, itemName: any} = {id: event[0].id, itemName : event[0].id};
      this.selectedVersion.push(temp);
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
    this.reportService.getNoConfigFoundReport(this.dataService.startDate, this.dataService.endDate, this.databaseHelper, this.version, this.states, this.boardNameList, this.dataService.isLiveAccount).subscribe(response=>{
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


  @ViewChild('multipleLogBtn') multipleLogBtn!:ElementRef
  @ViewChild('closeMulConfigBtn') closeMulConfigBtn!:ElementRef

  openMulConfigModal(){
    this.selectedStateName = '';
    this.taxonomyCode = '';
    this.selectedBoardConfig = [];
    this.selectedTaxonomy = [];
    this.noConfigProviderList = [];
    this.invalidTaxCodeToggle = false;
    this.invalidTaxStateToggle = false;
    this.multipleLogBtn.nativeElement.click();
    this.databaseHelper2 = new DatabaseHelper();
    this.getNoConfigTaxonomy();
  }

  configType:string='license';
  selectConfigType(event:any){
    if(event.target.checked){
      this.configType = 'board';
      this.boardConfigList = this.boardList;
    } else {
      this.configType = 'license';
    }
  }

  selectedBoardConfigName:string='';
  boardConfigId:number=0;
  selectBoardConfig(event:any) {
    debugger
    this.noBoardConfigToggle = false;
    this.noConfigProviderList = [];
    this.selectedBoardConfigName = '';
    this.boardConfigId = 0;
    if(event != undefined && event.length>0){
      this.selectedBoardConfigName = event[0].id;
      this.boardConfigId = event[0].boardConfigId;
    }
  }


  selectedStateName: string = '';
  taxonomyCode: string = '';
  invalidTaxCodeToggle:boolean = false;
  invalidTaxStateToggle:boolean = false;
  noBoardConfigToggle:boolean = false;
  searchProviderWithConfig() {
    this.noConfigProviderList = [];
    this.configList = [];
    this.selectedConfigId = 0;
    this.invalidTaxCodeToggle = false;
    this.invalidTaxStateToggle = false;
    this.noBoardConfigToggle = false;
    if(this.configType == 'license'){
      if(this.Constant.EMPTY_STRINGS.includes(this.selectedStateName)){
        this.invalidTaxStateToggle = true;
        return;
      }
      if(this.Constant.EMPTY_STRINGS.includes(this.taxonomyCode)){
        this.invalidTaxCodeToggle = true;
        return;
      }
    }

    this.selectedConfigId = this.boardConfigId;

    this.getNoConfigProvider();
  }

  noConfigProviderList: NoConfigProvider[] = new Array();
  noConfigProviderLoadingToggle:boolean = false;
  totalProviders:number=0;
  getNoConfigProvider() {
    debugger
    this.noConfigProviderLoadingToggle = true;
    this.reportService.getNoConfigProvider(this.taxonomyCode, this.selectedStateName, this.databaseHelper2, this.selectedBoardConfigName).subscribe(response=>{
      if(response != null){
        this.noConfigProviderList = response.providerList;
        this.totalProviders = response.totalProvider;
        if(this.configType == 'license') {
          this.configList = response.configList;
        }
      }

      if(this.configList != null && this.configList.length>0){
        this.configList = JSON.parse(JSON.stringify(this.configList));
      }

      this.noConfigProviderLoadingToggle = false;
    },error=>{
      this.noConfigProviderLoadingToggle = false;
    })
  }

  getNoConfigTaxonomy(){
    this.taxonomyList = [];
    this.reportService.getNoConfigTaxonomy().subscribe(response=>{
      if(response != null){
        this.taxonomyList = response;
      }

      if(this.taxonomyList != null && this.taxonomyList.length>0) {
        this.taxonomyList = JSON.parse(JSON.stringify(this.taxonomyList));
      }
    },error=>{

    })
  }

  databaseHelper2: DatabaseHelper = new DatabaseHelper();
  pageChangedNoConfigProvider(event:any){
    this.databaseHelper2.currentPage = event;
    this.getNoConfigProvider();
  }

  selectedConfigId:number=0;
  invalidConfigToggle:boolean = false;
  selectConfig(event:any){
    this.invalidConfigToggle = false;
    this.selectedConfigId = 0;
    if(event != undefined && event.length>0) {
      this.selectedConfigId = event[0].id;
    } 
  }

  selectTaxonomy(event:any){
    this.invalidTaxCodeToggle =false;
    this.taxonomyCode = '';
    if(event != undefined && event.length>0) {
      this.taxonomyCode = event[0].id;
    }
  }


  selectAllProvider(){
    this.isAllSelected = true;
  }

  logIds: number[] = new Array();
  isAllSelected: boolean = false;

  selectAll() {
    debugger
    this.selectProviderToggle = false;
    if (!this.isAllSelected) {
      this.isAllSelected = true;
      this.logIds = [];
      this.noConfigProviderList.forEach(element => {
        element.isChecked = true;
        this.logIds.push(element.logId);
      });
    } else {
      this.isAllSelected = false;
      this.noConfigProviderList.forEach(element => {
        element.isChecked = false;
      });
      this.logIds = [];
    }
  }

  selectOne(obj: any) {
    debugger
    this.selectProviderToggle = false;
    var i = this.logIds.findIndex(e => e == obj.logId);
    if (!obj.isChecked) {
      obj.isChecked = true;
      if (i == -1) {
        this.logIds.push(obj.logId);
      }
    } else {
      obj.isChecked = false;
      this.isAllSelected = false;
      if (i > -1) {
        this.logIds.splice(i, 1);
      }
    }
    if (this.logIds.length == this.noConfigProviderList.length) {
      this.isAllSelected = true;
    } else {
      this.isAllSelected = false;
    }
  }

  selectProviderToggle:boolean = false;
  configMappedToggle:boolean = false;
  submitProvider(){
    if(this.logIds.length==0) {
      this.selectProviderToggle = true;

      setTimeout(() => {
        this.selectProviderToggle = false;
      }, 1000);
      return;
    }

    if(this.configType == 'license' && this.selectedConfigId == 0){
      this.invalidConfigToggle = true;
      return;
    }

    this.mapConfigLog();
    this.configMappedToggle = true;
    setTimeout(() => {
      this.configMappedToggle = false;
      this.searchProviderWithConfig();
    }, 2500);
  }

  mapConfigSaveLoading:boolean = false;
  mapConfigLog(){
    this.mapConfigSaveLoading = true;
    this.reportService.mapConfigLog(this.logIds, this.selectedConfigId).subscribe(response=>{
      if(response.status){
        this.isAllSelected = false;
        this.getNoConfigProvider();
      } else {
        this.noBoardConfigToggle = true;
      }
      this.mapConfigSaveLoading = false;
    }, error=>{
      this.mapConfigSaveLoading = false;
    })
  }

  boardFilterToggle:boolean = false;
  filterByBoard(){
    this.boardFilterToggle = !this.boardFilterToggle;
  }


  getBoardConfigName() {
    this.boardList = [];
    this.reportService.getBoardConfigName(this.dataService.startDate, this.dataService.endDate).subscribe(response=>{
      if(response != null){
        this.boardList = response;
      }
    },error=>{

    })
  }

  boardNameList: string[] = [];
  selectBoardName(event:any) {
    debugger
    this.boardNameList = [];
    if(event != undefined && event.length > 0){
      event.forEach((element:any) => {
        this.boardNameList.push(element.itemName);
      });
    }
    this.getNoConfigFoundReport();
    this.boardFilterToggle = false;
  }


}
