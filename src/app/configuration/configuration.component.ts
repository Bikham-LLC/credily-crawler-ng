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

  }

  readonly Constant = Constant;
  databaseHelper:DatabaseHelper = new DatabaseHelper();
  lookupTaxonomyList:LookupTaxonomy[] = new Array();
  totalLookupTaxonomy : number = 0;
  loadingLookupTaxonomy:boolean = false;
  selectedTaxonomyIds:number[] = new Array();
  lookupName:string='';
  lookupLink:string='';

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
      enableSearchFilter: true,
      autoPosition: false
    }

    // this.getLookupTaxonomy();

  }

  logOut() {
    localStorage.clear();
    this._router.navigate(['/auth/login']);
  }

  getLookupTaxonomy(){
    this.loadingLookupTaxonomy = true;
    this.lookupTaxonomyService.getLookupTaxonomy(this.databaseHelper).subscribe(resp=>{

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
    this.closeTaxomonModalButton.nativeElement.click();
    setTimeout( () => {
      this.loadingIframe = false;
    }, 1000);
  }

  closeTaxonomyModal(){
    this.databaseHelper = new DatabaseHelper();
    this.selectedTaxonomyIds = [];
  }

  // ---------------------------------- add configuration section start --------------------------------

  @ViewChild('addConfigStepModalButton') addConfigStepModalButton !:ElementRef;
  @ViewChild('addStepForm') addStepForm : any;
  addStepFormInvalid:boolean=false;
  loadingIframe:boolean=false;

  licenseLookupConfigRequest : LicenseLookupConfigRequest = new LicenseLookupConfigRequest();
  cofigStepRequest : ConfigRequest = new ConfigRequest();
  configStepRequestList : ConfigRequest[] = new Array();

  dropdownSettingsAttribute!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
  selectedAttribute: any[] = new Array();
  attributeList: any[] = new Array();

  dropdownSettingsClass!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
  selectedClass: any[] = new Array();
  classList: any[] = new Array();

  dropdownSettingsColumn!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
  selectedColumn: any[] = new Array();
  columnList: any[] = new Array();

  openAddConfigModal(){
    this.cofigStepRequest  = new ConfigRequest();
    this.addConfigStepModalButton.nativeElement.click();
    this.getArribute();
  }

  getArribute(){
    for (let i = 0; i < Array(3).length; i++) {
      var temp: { id: any, itemName: any} = { id: '', itemName: '' };
      temp.id = i;
      temp.itemName = 'temp ' + i;
      this.attributeList.push(temp);
      this.classList.push(temp);
      this.columnList.push(temp);
    }
    this.attributeList = JSON.parse(JSON.stringify(this.attributeList));
    this.classList = JSON.parse(JSON.stringify(this.classList));
    this.columnList = JSON.parse(JSON.stringify(this.columnList));

  }

  selectCrawlerAttribute(event:any){
    if (event[0] != undefined) {
      this.selectedAttribute = event;
    }
  }
  selectClassName(event:any){
    if (event[0] != undefined) {
      this.selectedClass = event;
    }
  }
  selectColumnName(event:any){
    if (event[0] != undefined) {
      this.selectedColumn = event;
    }
  }
  onSearch(event: any) {
    debugger
    // this.getTaxonomy(event.target.value);
  }

  closeAddConfigStepModal(){
    this.attributeList = [];
    this.classList = [];
    this.columnList = [];
    this.selectedAttribute = [];
    this.selectedClass = [];
    this.selectedColumn = [];
  }

  addConfigurationStep(){

    this.addStepFormInvalid = false;
    if(this.addStepForm.invalid){
      this.addStepFormInvalid = true;
      return;
    }


  }

  saveConfiguration(){
    this.licenseLookupConfigRequest.licenseLookUpName = this.lookupName;
    this.licenseLookupConfigRequest.licenseLookUpLink = this.lookupLink;
    this.licenseLookupConfigRequest.taxonomyIdList = this.selectedTaxonomyIds;
    this.licenseLookupConfigRequest.userAccountUuid = String(localStorage.getItem(this.Constant.ACCOUNT_UUID));
    this.licenseLookupConfigRequest.configRequests = this.configStepRequestList;
  }

}
