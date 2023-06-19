import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseHelper } from '../models/DatabaseHelper';
import { LookupTaxonomy } from '../models/LookupTaxonomy';
import { LookupTaxonomyService } from '../services/lookup-taxonomy.service';
import { DataService } from '../services/data.service';
import { ConfigRequest } from '../models/ConfigRequest';
import { LicenseLookupConfigRequest } from '../models/LicenseLookupConfigRequest';
import { Constant } from '../models/Constant';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  constructor(
    private _router: Router,
    private lookupTaxonomyService:LookupTaxonomyService,
    private dataService:DataService) { 
      if(!this.Constant.EMPTY_STRINGS.includes(localStorage.getItem(this.Constant.USER_NAME))){
        this.userName = String(localStorage.getItem(this.Constant.USER_NAME));
      }
  }

  readonly Constant = Constant;
  userName:string='Logged In';
  databaseHelper:DatabaseHelper = new DatabaseHelper();
  lookupTaxonomyList:LookupTaxonomy[] = new Array();
  totalLookupTaxonomy : number = 0;
  loadingLookupTaxonomy:boolean = false;
  selectedTaxonomyIds:number[] = new Array();
  lookupName:string='';
  lookupLink:string='';
  iframeUrl:string='';
  selectedStateName:string='';
  @ViewChild('lookupModalButton') lookupModalButton !:ElementRef;

  addStepToggle:boolean=false;

  ngOnInit(): void {

    this.dropdownSettingsAttribute = {
      singleSelection: true,
      text: 'Select Attribute',
      enableSearchFilter: true,
      autoPosition: false
    }
    this.dropdownSettingsClass = {
      singleSelection: true,
      text: 'Select Class',
      enableSearchFilter: true,
      autoPosition: false
    }
    this.dropdownSettingsColumn = {
      singleSelection: true,
      text: 'Select Column',
      enableSearchFilter: false,
      autoPosition: false,
      noDataLabel: 'Select Class Name First'
    }

    // this.getLookupTaxonomy();
    // this.getArribute();
    // this.getClassName();

  }

  logOut() {
    localStorage.clear();
    this._router.navigate(['/auth/login']);
  }

  openLookupModal(){
    this.selectedTaxonomyIds = [];
    this.databaseHelper = new DatabaseHelper();
    this.lookupLink = '';
    this.lookupName = '';
    this.selectedStateName = '';
    this.lookupModalButton.nativeElement.click();
    this.getLookupTaxonomy();
  }

  getLookupTaxonomy(){
    debugger
    this.loadingLookupTaxonomy = true;
    this.lookupTaxonomyService.getLookupTaxonomy(this.databaseHelper, this.selectedStateName).subscribe(resp=>{

      if(resp.status && resp.object!=null){
        this.lookupTaxonomyList = resp.object;
        this.totalLookupTaxonomy = resp.totalItems;

        if(this.selectedTaxonomyIds.length>0){
          this.lookupTaxonomyList.forEach(x=>{
            if(this.selectedTaxonomyIds.includes(x.id)){
              x.checked = true;
            }
          })
        }
        

      }

      this.loadingLookupTaxonomy = false;
    },error=>{
      this.loadingLookupTaxonomy = false;
      this.dataService.showToast(error.error);
    })
  }

  pageChanged(event: any) {
    if (event != this.databaseHelper.currentPage) {
      this.databaseHelper.currentPage = event;
      this.getLookupTaxonomy();
    }
  }

  selectStateName(){
    this.getLookupTaxonomy();
  }

  searchTaxonomy(){
    this.getLookupTaxonomy();
  }


  selectTaxonomySingle(index:number){
    debugger

    if(this.lookupTaxonomyList[index].checked==undefined){
      this.lookupTaxonomyList[index].checked = false;
    }

    if(this.lookupTaxonomyList[index].checked){
      var i = this.selectedTaxonomyIds.findIndex(x=>x==this.lookupTaxonomyList[index].id);
      if(i>-1){
        this.selectedTaxonomyIds.splice(1, i);
      }

    }else{
      this.selectedTaxonomyIds.push(this.lookupTaxonomyList[index].id);
    }

    this.lookupTaxonomyList[index].checked = !this.lookupTaxonomyList[index].checked;
    
  }

  @ViewChild('closeTaxomonModalButton') closeTaxomonModalButton!:ElementRef;
  saveLookupDetails(){
    debugger
    this.addStepToggle = true;
    this.loadingIframe = true;
    this.configurationStepList = [];
    this.closeTaxomonModalButton.nativeElement.click();
    setTimeout( () => {
      this.loadingIframe = false;
    }, 1000);
  }

  closeTaxonomyModal(){
    this.databaseHelper = new DatabaseHelper();
    // this.selectedTaxonomyIds = [];
  }

  // ---------------------------------- add configuration section start --------------------------------

  @ViewChild('addConfigStepModalButton') addConfigStepModalButton !:ElementRef;
  @ViewChild('closeAddStepModal') closeAddStepModal !:ElementRef;
  @ViewChild('addStepForm') addStepForm : any;
  addStepFormInvalid:boolean=false;
  loadingIframe:boolean=false;
  isInvalidConfiguration:boolean=false;
  testingConfiguration:boolean=false;
  savingConfiguration:boolean=false;

  licenseLookupConfigRequest : LicenseLookupConfigRequest = new LicenseLookupConfigRequest();
  cofigStepRequest : ConfigRequest = new ConfigRequest();
  configurationStepList : ConfigRequest[] = new Array();

  dropdownSettingsAttribute!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
  selectedAttribute: any[] = new Array();
  attributeList: any[] = new Array();

  dropdownSettingsClass!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
  selectedClass: any[] = new Array();
  classList: any[] = new Array();

  dropdownSettingsColumn!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean; noDataLabel: string };
  selectedColumn: any[] = new Array();
  columnList: any[] = new Array();

  openAddConfigModal(){
    this.iframeUrl = this.lookupLink;
    this.cofigStepRequest  = new ConfigRequest();
    this.addConfigStepModalButton.nativeElement.click();
    this.getArribute();
    this.getClassName();
  }

  getArribute(){
    // for (let i = 0; i < Array(3).length; i++) {
    //   var temp: { id: any, itemName: any} = { id: '', itemName: '' };
    //   temp.id = i+1;
    //   temp.itemName = 'Attribute ' + i;
    //   this.attributeList.push(temp);
    // }

    this.lookupTaxonomyService.getCrawlerAttribute().subscribe(response=>{
      this.attributeList = response.object;
    })

    this.attributeList = JSON.parse(JSON.stringify(this.attributeList));

  }

  getClassName(){

    var temp: { id: any, itemName: any} = { id: 'static', itemName: 'static' };
    this.classList.push(temp);

    // this.lookupTaxonomyService.getClassName().subscribe(response=>{
    //   this.classList = response.object;
    // })
    this.classList = JSON.parse(JSON.stringify(this.classList));
  }

  getCloumnName(className:string){
    this.lookupTaxonomyService.getColumnName(className).subscribe(response=>{
      this.columnList = response.object;
    })
    this.columnList = JSON.parse(JSON.stringify(this.columnList));
  }

  selectCrawlerAttribute(event:any){
    debugger
    this.cofigStepRequest.crawlerAttributeId = 0;
    if (event[0] != undefined) {
      this.selectedAttribute = event;
      this.cofigStepRequest.crawlerAttributeId = event[0].id;
    }
  }
  selectClassName(event:any){
    debugger
    this.cofigStepRequest.className = '';
    this.columnList = [];
    if (event[0] != undefined) {
      this.selectedClass = event;
      this.cofigStepRequest.className = event[0].itemName;
      this.getCloumnName(this.cofigStepRequest.className);
    }else{
      this.columnList = [];
      this.selectedColumn = [];
    }
  }
  selectColumnName(event:any){
    debugger
    this.cofigStepRequest.columnName = '';
    if (event[0] != undefined) {
      this.selectedColumn = event;
      this.cofigStepRequest.columnName = event[0].itemName;
    }
  }
  onSearch(event: any) {
    debugger
    // this.getTaxonomy(event.target.value);
  }
  onOpen(event:any){
    debugger
    if(!this.Constant.EMPTY_STRINGS.includes(this.cofigStepRequest.className)){
      this.dropdownSettingsColumn = {
        singleSelection: true,
        text: 'Select Column',
        enableSearchFilter: true,
        autoPosition: false,
        noDataLabel:"No Data Available",
      };
    }else{
      this.dropdownSettingsColumn = {
        singleSelection: true,
        text: 'Select Column',
        enableSearchFilter: false,
        autoPosition: false,
        noDataLabel:"Select Class Name First",
      };
    }
    
  }

  closeAddConfigStepModal(){
    debugger
    this.attributeList = [];
    this.classList = [];
    this.columnList = [];
    this.selectedAttribute = [];
    this.selectedClass = [];
    this.selectedColumn = [];
  }

  addConfigurationStep(){
    debugger
    this.addStepFormInvalid = false;
    if(this.addStepForm.invalid){
      this.addStepFormInvalid = true;
      return;
    }
    this.configurationStepList.push(this.cofigStepRequest);
    this.closeAddStepModal.nativeElement.click();
  }

  providerUuid:string='';
  @ViewChild('uuidModalButton') uuidModalButton !:ElementRef;
  @ViewChild('closeUuidModal') closeUuidModal !:ElementRef;

  openUuidModal(){
    this.uuidModalButton.nativeElement.click();
  }

  testConfiguration(){
    debugger

    // this.closeUuidModal.nativeElement.click();

    this.licenseLookupConfigRequest.licenseLookUpName = this.lookupName;
    this.licenseLookupConfigRequest.licenseLookUpLink = this.lookupLink;
    this.licenseLookupConfigRequest.taxonomyIdList = this.selectedTaxonomyIds;
    this.licenseLookupConfigRequest.userAccountUuid = String(localStorage.getItem(this.Constant.ACCOUNT_UUID));
    this.licenseLookupConfigRequest.configRequests = this.configurationStepList;
    this.testingConfiguration = true;
    this.isInvalidConfiguration = false;
    this.lookupTaxonomyService.testConfiguration(this.licenseLookupConfigRequest, this.providerUuid).subscribe(response=>{
      this.testingConfiguration = false;
      if(response.object!=null){
        this.iframeUrl = response.object;
      }
      setTimeout(()=>{
        this.closeUuidModal.nativeElement.click();
        this.dataService.showToast('Valid Configuration.');
      },500)
      

    },error=>{
      this.isInvalidConfiguration = true;
      this.testingConfiguration = false;
    })
  }

  async saveConfiguration(){
    debugger
    this.savingConfiguration = true;
    
    // await this.testConfiguration();

    this.licenseLookupConfigRequest.licenseLookUpName = this.lookupName;
    this.licenseLookupConfigRequest.licenseLookUpLink = this.lookupLink;
    this.licenseLookupConfigRequest.taxonomyIdList = this.selectedTaxonomyIds;
    this.licenseLookupConfigRequest.userAccountUuid = String(localStorage.getItem(this.Constant.ACCOUNT_UUID));
    this.licenseLookupConfigRequest.configRequests = this.configurationStepList;

    if(!this.isInvalidConfiguration){
      this.lookupTaxonomyService.createConfiguration(this.licenseLookupConfigRequest).subscribe(response=>{
        this.savingConfiguration = false;
        this.dataService.showToast('Configuration Saved Successfully.');
        this.addStepToggle = false;
      },error=>{
        this.savingConfiguration = false;
        this.dataService.showToast(error.error);
      })
    }
  }

}
