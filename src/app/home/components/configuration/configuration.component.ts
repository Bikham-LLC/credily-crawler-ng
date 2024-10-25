import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Constant } from 'src/app/models/Constant';
import { Route } from 'src/app/models/Route';
import { LicenseLookupService } from 'src/app/services/license-lookup.service';
import { DataService } from 'src/app/services/data.service';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { LookupTaxonomy } from 'src/app/models/LookupTaxonomy';
import { LookupConfiguration } from 'src/app/models/LookupConfiguration';
import { ConfigRequest } from 'src/app/models/ConfigRequest';
import { LicenseLookupConfigRequest } from 'src/app/models/LicenseLookupConfigRequest';
import { FormStructure } from 'src/app/models/formStructure';
import { SubAttributeMap } from 'src/app/models/SubAttributeMap';
import { RemoveStepRequest } from 'src/app/models/RemoveStepRequest';
import { AuditTrail } from 'src/app/models/AuditTrail';
import { HeaderSubscriptionService } from 'src/app/services/header-subscription.service';
import { RpaTestRequest } from 'src/app/models/RpaTestRequest';
import { USStates } from 'src/app/models/UsStatesJson';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  readonly Constant = Constant;
  readonly Route = Route;

  configSearch = new Subject<string>();
  configSearchByLink = new Subject<string>();

  auditConfigNameSearch = new Subject<string>();
  auditConfigLinkSearch = new Subject<string>();
  taxonomySearch = new Subject<string>();

  search: string = '';
  searchLink: string = '';
  constructor(
    private _router: Router,
    private sanitizer: DomSanitizer,
    private licenseLookupService: LicenseLookupService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private headerSubscriptionService: HeaderSubscriptionService) {


    if (this.route.snapshot.queryParamMap.has('id')) {
      this.configurationId = Number(this.route.snapshot.queryParamMap.get('id'));
    }

    this.ticketTypeList = [{ id: 'provider', itemName: 'provider' }, { id: 'location', itemName: 'location' }];

    this.configSearch.pipe(
      debounceTime(600))
      .subscribe(value => {
        this.configDatabaseHelper.currentPage = 1;
        this.configDatabaseHelper.search = this.search;
        this.configDatabaseHelper.searchBy = 'licenseLookupName';
        this.getConfiguration();
      });

    this.configSearchByLink.pipe(
      debounceTime(600))
      .subscribe(value => {
        this.configDatabaseHelper.currentPage = 1;
        this.configDatabaseHelper.search = this.searchLink;
        this.configDatabaseHelper.searchBy = 'licenseLookupLink';
        this.getConfiguration();
      });

    this.auditConfigNameSearch.pipe(
      debounceTime(600))
      .subscribe(value => {
        this.auditTrailDatabaseHelper.currentPage = 1;
        this.auditTrailDatabaseHelper.searchBy = 'configName';
        this.auditTrailDatabaseHelper.search = this.auditConfigName;
        this.getAuditTrail();
      });

    this.auditConfigLinkSearch.pipe(
      debounceTime(600))
      .subscribe(value => {
        this.auditTrailDatabaseHelper.currentPage = 1;
        this.auditTrailDatabaseHelper.searchBy = 'configLink';
        this.auditTrailDatabaseHelper.search = this.auditConfigLink;
        this.getAuditTrail();
      });

      this.taxonomySearch.pipe(
        debounceTime(400))
        .subscribe(value => {
          this.databaseHelper.currentPage = 1;
          this.getMappedTaxonomy(this.type);
        });
  

      this.subscribeHeader = this.headerSubscriptionService.headerVisibilityChange.subscribe(async (value) => {
        debugger
        if(_router.url == Route.HOME_CONFIGURATION_ROUTE && this.showAuditTrailToggle){
          this.getAuditTrail();
        }
      })
  }

  subscribeHeader:any;
  configurationId :number =0;

  userName: string = 'Logged In';
  databaseHelper: DatabaseHelper = new DatabaseHelper();
  lookupTaxonomyList: LookupTaxonomy[] = new Array();
  totalLookupTaxonomy: number = 0;
  loadingLookupTaxonomy: boolean = false;
  selectedTaxonomyIds: any[] = new Array();
  lookupName: string = '';
  lookupLink: string = '';
  selectedStateName: string = '';
  credilyVersion: string = '';

  crawlerType: string = this.Constant.CRAWLER_TYPE_LICENSE_LOOKUP;

  @ViewChild('lookupModalButton') lookupModalButton !: ElementRef;
  @ViewChild('mapLookupTaxonomyForm') mapLookupTaxonomyForm: any;


  dropdownSettingsTaxonomyLink !: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean; searchPlaceholderText: string; };
  selectedTaxonomyLink: any[] = new Array();
  taxonomyLinkList: any[] = new Array();

  dropdownSettingsTicketType !: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
  ticketTypeList: any[] = new Array();
  selectedTicketType: any[] = new Array();

  addStepToggle: boolean = false;

  dropdownSettingsAttachmentType !: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
  selectedAttType: any[] = new Array();
  attTypeList: any[] = new Array();

  dropdownSettingsAttachmentSubType !: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
  selectedAttSubType: any[] = new Array();
  attSubTypeList: any[] = new Array();

  dropdownSettingsQueue !: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
  selectedQueue: any[] = new Array();
  queueList: any[] = new Array();

  dropdownSettingsState !: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
  selectedState: any[] = new Array();
  stateList: any[] = new Array();

  ngOnInit(): void {

    this.dropdownSettingsAttribute = {
      singleSelection: true,
      text: 'Select Attribute',
      enableSearchFilter: true,
      autoPosition: false
    }
    this.dropdownSettingsEvent = {
      singleSelection: true,
      text: 'Select Event',
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
    this.dropdownSettingsTaxonomyLink = {
      singleSelection: true,
      text: 'Select Link',
      enableSearchFilter: true,
      autoPosition: false,
      searchPlaceholderText: 'Search By Name'
    }
    this.dropdownSettingsLookupNames = {
      singleSelection: false,
      badgeShowLimit: 1,
      text: 'Linked boards name',
      autoPosition: false,
      enableSearchFilter: false,
      classes: "activeSelectBox",
      enableCheckAll: true
    }

    this.dropdownSettingsAttachmentType = {
      singleSelection: true,
      text: 'Select Attachment Type',
      enableSearchFilter: true,
      autoPosition: false
    }

    this.dropdownSettingsAttachmentSubType = {
      singleSelection: true,
      text: 'Select Attachment Sub Type',
      enableSearchFilter: true,
      autoPosition: false
    }

    this.dropdownSettingsTicketType = {
      singleSelection: true,
      text: 'Select Ticket Type',
      enableSearchFilter: true,
      autoPosition: false
    }

    this.dropdownSettingsQueue = {
      singleSelection: true,
      text: 'Select Queue',
      enableSearchFilter: true,
      autoPosition: false
    }

    this.dropdownSettingsState = {
      singleSelection: true,
      text: 'Select State',
      enableSearchFilter: true,
      autoPosition: false
    }

    this.getConfiguration();
    this.openEditModalFromReport();
    this.getAllTestQueue();
  }

  drop(event: CdkDragDrop<any[]>) {
    debugger
    moveItemInArray(this.configurationStepList, event.previousIndex, event.currentIndex);
  }

  removeStepList:RemoveStepRequest[]=[];
  removeStep(i: any) {
    let removeStepRequest = new RemoveStepRequest();
    removeStepRequest.attributeName = this.configurationStepList[i].crawlerAttribute;
    removeStepRequest.lookupElementDesc = this.configurationStepList[i].lookUpElementDesc;
    this.removeStepList.push(removeStepRequest);

    this.configurationStepList.splice(i, 1);
  }

  logOut() {
    localStorage.clear();
    this._router.navigate(['/auth/login']);
  }

  loadingConfiguration: boolean = false;
  configList: LookupConfiguration[] = new Array();
  totalConfiguration: number = 0;
  configDatabaseHelper: DatabaseHelper = new DatabaseHelper();

  getConfiguration() {
    debugger
    this.loadingConfiguration = true;
    this.licenseLookupService.getConfiguration(this.configDatabaseHelper, '', this.crawlerType).subscribe(response => {
      if (response.status && response.object != null) {
        this.configList = response.object;
        this.totalConfiguration = response.totalItems;
      }
      this.loadingConfiguration = false;
    }, error => {
      this.loadingConfiguration = false;
    })
  }

  configPageChanged(event: any) {
    if (event != this.configDatabaseHelper.currentPage) {
      this.configDatabaseHelper.currentPage = event;
      this.getConfiguration();
    }
  }

  openConfigModal() {
    this.selectedTaxonomyIds = [];
    this.lookupTaxonomyList = [];
    this.selectedTaxonomyLink = [];
    this.updateLinkToggle = false;
    this.credilyVersion = '';
    this.databaseHelper = new DatabaseHelper();
    this.lookupLink = '';
    this.rpaEndPoint = '';
    this.lookupName = '';
    this.planId = '';
    this.selectedStateName = '';
    this.attachmentType = '';
    this.attachmentSubType = '';
    this.attTypeList = [];
    this.attSubTypeList = [];
    this.selectedAttType = [];
    this.selectedAttSubType = [];
    this.configurationStepList = [];
    this.selectedLookupConfigId = 0;
    this.selectedLookupName = [];
    this.lookupModalButton.nativeElement.click();
    this.type = 'mapped';
    this.showTaxonomyListToggle = false;
    this.totalLookupTaxonomy = 0;
    this.getTaxonomyLink('');
    this.getAttachmentType();
  }

  selectTaxonomyLink(event: any) {
    debugger
    this.lookupLink = '';
    this.selectedTaxonomyIds = [];
    if (event[0] != undefined) {
      var temp: { id: any, itemName: any } = { id: event[0].id, itemName: event[0].id };
      this.selectedTaxonomyLink = [];
      this.selectedTaxonomyLink.push(temp);
      this.lookupLink = event[0].id;
      if(this.crawlerType == this.Constant.CRAWLER_TYPE_LICENSE_LOOKUP || this.crawlerType == this.Constant.RPA){
        this.getTaxonomyByLookupLink(this.lookupLink);
      }
      this.selectedlookupName(this.lookupLink);
    } else {
      this.getMappedTaxonomy(this.type);
    }
  }

  allLookupNamesList: any[] = new Array();
  totalLookupName: number = 0;
  selectedlookupName(lookupLink: any) {
    debugger
    this.selectedLookupNames = [];
    this.mappedLookupNames = [];
    this.licenseLookupService.getLinkLookupName(lookupLink, this.crawlerType).subscribe(response => {
      if (response.dtoList != null) {
        this.allLookupNamesList = response.dtoList;
        this.allLookupNamesList.forEach(element => {
          var temp: { id: any, itemName: any } = { id: element.taxanomyId, itemName: element.lookupName };
          this.selectedLookupNames.push(temp);
          this.mappedLookupNames.push(temp);
          this.selectedLookupName.push(element.lookupName);
        })
        this.selectedLookupNames = JSON.parse(JSON.stringify(this.selectedLookupNames));
        this.mappedLookupNames = JSON.parse(JSON.stringify(this.mappedLookupNames));
        this.totalLookupName = response.totalItems;
      }
    })
  }

  selectedLookupName: string[] = [];
  searchSelectLookupName(event: any) {
    debugger
    if (event != undefined && event.length > 0) {
      this.selectedLookupName = [];
      event.forEach((e: any) => {
        this.selectedLookupName.push(e.itemName);
      })
      this.getTaxIdsWithLookupName(this.selectedLookupName);
    } else {
      this.selectedTaxonomyIds = [];
      this.getMappedTaxonomy('mapped');
    }
  }

  getTaxIdsWithLookupName(lookupNames: any) {
    debugger
    this.loadingLookupTaxonomy = true;
    this.licenseLookupService.getTaxIdsWithLookupName(lookupNames, this.lookupLink).subscribe(response => {
      this.selectedTaxonomyIds = response;
      this.getMappedTaxonomy('mapped');
    }, error => {

    })
  }

  taxanomyLinkLoading: boolean = false;
  async getTaxonomyLink(search: string) {
    debugger
    if (!this.Constant.EMPTY_STRINGS.includes(this.lookupLink)) {
      this.taxanomyLinkLoading = true;
    }
    this.licenseLookupService.getTaxonomyLink(search, this.crawlerType).subscribe(response => {
      if (response.object != null) {
        this.taxonomyLinkList = [];
        response.object.forEach((element: any) => {
          var temp: { id: any, itemName: any } = { id: element.link, itemName: element.name + ' - ' + element.link };
          this.taxonomyLinkList.push(temp);
        })
      }
      if (!this.Constant.EMPTY_STRINGS.includes(this.lookupLink)) {
        this.selectedTaxonomyLink = [];
        var temp: { id: any, itemName: any } = { id: this.lookupLink, itemName: this.lookupLink };
        this.selectedTaxonomyLink.push(temp);
        if(this.crawlerType == this.Constant.CRAWLER_TYPE_LICENSE_LOOKUP  || this.crawlerType == this.Constant.RPA){
          this.getTaxonomyByLookupLink(this.lookupLink);
        }
        this.selectedlookupName(this.lookupLink);
      }
      this.taxanomyLinkLoading = false;
    }, error => {
      this.taxanomyLinkLoading = false;
    })
    this.taxonomyLinkList = JSON.parse(JSON.stringify(this.taxonomyLinkList));
  }

  onSearchLink(event: any) {
    debugger
    this.getTaxonomyLink(event.target.value);
  }
  getTaxonomyByLookupLink(lookupLink: string) {
    debugger
    this.selectedTaxonomyIds = [];
    this.loadingLookupTaxonomy = true;
    this.licenseLookupService.getLinkTaxonomyIds(lookupLink, this.configId).subscribe(resp => {
      if (resp != null) {
        this.selectedTaxonomyIds = resp;
        if (this.selectedTaxonomyIds.length > 0) {
          this.lookupTaxonomyList.forEach(x => {
            if (this.selectedTaxonomyIds.includes(x.id)) {
              x.checked = true;
            }
          })
        }
        this.getMappedTaxonomy(this.type);
      }
    }, error => {
      this.loadingLookupTaxonomy = false;
    })
  }

  pageChanged(event: any) {
    if (event != this.databaseHelper.currentPage) {
      this.databaseHelper.currentPage = event;
      this.getMappedTaxonomy(this.type);
    }
  }

  selectStateName() {
    this.databaseHelper.currentPage = 1;
    this.getMappedTaxonomy(this.type);
  }


  mappedIds: number[] = new Array();
  unMappedIds: number[] = new Array();
  selectTaxonomySingle(index: number) {
    debugger

    if (this.lookupTaxonomyList[index].checked == undefined) {
      this.lookupTaxonomyList[index].checked = false;
    }

    if (this.lookupTaxonomyList[index].checked) {
      var i = this.selectedTaxonomyIds.findIndex(x => x == this.lookupTaxonomyList[index].id);
      if (i > -1) {
        this.selectedTaxonomyIds.splice(i, 1);
        this.unMappedIds.push(this.lookupTaxonomyList[index].id);
      }
    } else {
      this.selectedTaxonomyIds.push(this.lookupTaxonomyList[index].id);
      this.mappedIds.push(this.lookupTaxonomyList[index].id);
      this.mapTaxonomyToggle = false;
    }
    this.lookupTaxonomyList.splice(index, 1);
    this.totalLookupTaxonomy--;
  }

  @ViewChild('closeTaxomonyModalButton') closeTaxomonyModalButton!: ElementRef;
  @ViewChild('clickIframeButton') clickIframeButton!: ElementRef;
  setText: any;
  crawlerConfigRequest: ConfigRequest = new ConfigRequest();
  mapTaxonomyToggle:boolean = false;
  saveRpaConfigToggle:boolean =false;
  saveLookupDetailsAndToggleAddStep() {
    debugger
    this.mapTaxonomyToggle = false;
    this.saveRpaConfigToggle = false;
    if(this.crawlerType == this.Constant.RPA){
      if(this.selectedTaxonomyIds.length == 0){
        this.mapTaxonomyToggle = true;
        return;
      } else {
        this.saveRpaConfigToggle = true;
        this.saveConfiguration();
      }
    } else {
      this.addStepToggle = true;
      if (this.selectedLookupConfigId > 0) {
        this.getCrawlerAttrMap(this.selectedLookupConfigId);
      }
      this.closeTaxomonyModalButton.nativeElement.click();
    }
    this.configurationStepList = [];
    this.setText = this.lookupLink.split('//')[1];
  }

  src !: SafeResourceUrl;
  loadSite(lookupUrl: any) {
    debugger
    this.loadingIframe = true;
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl('https://' + lookupUrl.target.textContent);
  }

  onLoad() {
    debugger
    this.loadingIframe = false;
  }

  closeTaxonomyModal() {
    this.databaseHelper = new DatabaseHelper();
    this.type = 'mapped';
    this.newLinkToggle = false;
    this.configId = 0;
    if(this.configurationId >0){
      this._router.navigate([Route.HOME_CONFIGURATION_ROUTE]);
    }
  }


  selectTicketType(event :any){
    debugger
    if(event[0] != undefined){
     this.selectedTicketType = event;
     this.ticketType = event[0].id;
    }
  }

  // ---------------------------------- add configuration section start --------------------------------

  @ViewChild('addConfigStepModalButton') addConfigStepModalButton !: ElementRef;
  @ViewChild('closeAddStepModal') closeAddStepModal !: ElementRef;
  @ViewChild('addStepForm') addStepForm: any;
  addStepFormInvalid: boolean = false;
  loadingIframe: boolean = false;
  isInvalidConfiguration: boolean = false;
  testingConfiguration: boolean = false;
  savingConfiguration: boolean = false;

  licenseLookupConfigRequest: LicenseLookupConfigRequest = new LicenseLookupConfigRequest();
  cofnigStepRequest: ConfigRequest = new ConfigRequest();
  configurationStepList: ConfigRequest[] = new Array();

  dropdownSettingsAttribute!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
  selectedAttribute: any[] = new Array();
  attributeList: any[] = new Array();

  dropdownSettingsEvent!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
  selectedEvent: any[] = new Array();
  EventList: any[] = [{ id: 'sendKey', itemName: 'Input Value' }, { id: 'click', itemName: 'Click' }]

  dropdownSettingsClass!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean };
  selectedClass: any[] = new Array();
  classList: any[] = new Array();

  dropdownSettingsColumn!: { singleSelection: boolean; text: string; enableSearchFilter: boolean; autoPosition: boolean; noDataLabel: string };
  selectedColumn: any[] = new Array();
  columnList: any[] = new Array();

  dropdownSettingsLookupNames!: { singleSelection: boolean; text: string; autoPosition: boolean; enableSearchFilter: boolean; badgeShowLimit: number; classes: string; enableCheckAll: boolean; };
  selectedLookupNames: any[] = new Array();
  mappedLookupNames: any[] = new Array();

  openAddConfigModal() {
    this.attributeList = [];
    this.classList = [];
    this.columnList = [];
    this.selectedAttribute = [];
    this.selectedClass = [];
    this.selectedColumn = [];
    this.selectedEvent = [];
    this.EventList = [];
    this.customAttribute = '';
    this.customTag = '';
    this.selectedColumnNames = '';
    this.customValue = '';
    this.attTypeList = [];
    this.cofnigStepRequest = new ConfigRequest();
    this.addConfigStepModalButton.nativeElement.click();
    this.getArribute();
    this.getClassName();
    this.EventList = [{ id: 'sendKey', itemName: 'Input Value' }, { id: 'click', itemName: 'Click' }, { id: 'windowClick', itemName: 'Click Window' }];
    this.dropdownSettingsEvent = {
      singleSelection: true,
      text: 'Select Event',
      enableSearchFilter: true,
      autoPosition: false
    }
  }

  getArribute() {
    this.licenseLookupService.getCrawlerAttribute().subscribe(response => {
      this.attributeList = response.object;
      this.attributeList = JSON.parse(JSON.stringify(this.attributeList));
    })
  }

  getClassName() {
    this.licenseLookupService.getClassName().subscribe(response => {
      if (response.object != null) {
        this.classList = [];
        Object.keys(response.object).forEach((key, index) => {
          var temp: { id: any, itemName: any } = { id: key, itemName: response.object[key] };
          this.classList.push(temp);
        });
      }
    })
    this.classList = JSON.parse(JSON.stringify(this.classList));
  }


  selectCrawlerAttribute(event: any) {
    debugger
    this.cofnigStepRequest.crawlerAttributeId = 0;
    if (event[0] != undefined) {
      this.selectedAttribute = event;
      this.cofnigStepRequest.crawlerAttributeId = event[0].id;
      this.cofnigStepRequest.crawlerAttribute = event[0].itemName;
      this.selectedEvent = [];
      if (event[0].id == 6) {
        this.EventList = [
          { id: '2', itemName: '2 Second' }, { id: '4', itemName: '4 Second' },
          { id: '6', itemName: '6 Second' }, { id: '8', itemName: '8 Second' },
          { id: '10', itemName: '10 Second' }
        ];
        this.dropdownSettingsEvent = {
          singleSelection: true,
          text: 'Select Delay',
          enableSearchFilter: true,
          autoPosition: false
        }
      } else {
        this.EventList = [{ id: 'sendKey', itemName: 'Input Value' }, { id: 'click', itemName: 'Click' }, { id: 'windowClick', itemName: 'Click Window' }];
        this.dropdownSettingsEvent = {
          singleSelection: true,
          text: 'Select Event',
          enableSearchFilter: true,
          autoPosition: false
        }
      }
    }
  }

  selectCrawlerEvent(event: any) {
    debugger
    this.cofnigStepRequest.elementEvent = '';
    if (event[0] != undefined) {
      this.selectedEvent = event;
      this.cofnigStepRequest.elementEvent = event[0].id;
    }
  }

  selectClassName(event: any) {
    debugger
    this.cofnigStepRequest.className = '';
    this.columnList = [];
    this.subClassToggle = false;
    if (event[0] != undefined) {
      this.selectedClass = event;
      this.cofnigStepRequest.className = event[0].itemName;
      if (this.cofnigStepRequest.className.toLowerCase() != 'static') {
        this.getPrimaryColumn(this.cofnigStepRequest.className);
        this.appUpdateSubStructureModalButton.nativeElement.click();
      }

    } else {
      this.columnList = [];
      this.selectedColumn = [];
    }
  }

  customTag: string = '';
  customAttribute: string = '';
  customValue: string = '';

  addConfigurationStep() {
    debugger
    this.selectedColumnNames = '';
    this.addStepFormInvalid = false;
    if (this.addStepForm.invalid) {
      this.addStepFormInvalid = true;
      return;
    }
    if (this.cofnigStepRequest.crawlerAttributeId == 17) {
      this.cofnigStepRequest.lookUpElementDesc = "//" + this.customTag + "[@" + this.customAttribute + "='" + this.customValue + "']";
    }
    if(!this.isEditStepToggle){
      this.cofnigStepRequest.isNewStep = 1;
      this.configurationStepList.push(this.cofnigStepRequest);
    } else {
      this.editStep(this.editStepIndex, this.cofnigStepRequest);
    }
    this.closeAddStepModal.nativeElement.click();
  }

  editStep(index:number, cofnigStepRequest: ConfigRequest){
    this.configurationStepList.splice(index, 1, cofnigStepRequest);
  }

  closeStepModal(){
    this.closeAddStepModal.nativeElement.click();
    this.isEditStepToggle = false;
  }

  isEditStepToggle: boolean = false;
  editStepIndex : number = 0;
  openEditStepModal(step:ConfigRequest, index:number){
    debugger
    this.cofnigStepRequest.isStepUpdted = false;
    this.selectedAttribute =[];
    this.isEditStepToggle = true;
    this.editStepIndex = index;
    this.openAddConfigModal();
    
    var temp : {id: any, itemName:any} = {id:step.crawlerAttributeId, itemName:step.crawlerAttribute};
    this.selectedAttribute.push(temp);
    this.cofnigStepRequest.lookUpElementDesc = this.configurationStepList[index].lookUpElementDesc
    this.cofnigStepRequest.crawlerAttributeId = this.configurationStepList[index].crawlerAttributeId;
    this.cofnigStepRequest.crawlerAttribute = this.configurationStepList[index].crawlerAttribute;
    this.cofnigStepRequest.isStepUpdted = true;

    var eventTemp = {id: '', itemName:''};
    if(!this.Constant.EMPTY_STRINGS.includes(step.elementEvent)){
      if (this.configurationStepList[index].crawlerAttributeId == 6) {
        this.EventList = [
          { id: '2', itemName: '2 Second' }, { id: '4', itemName: '4 Second' },
          { id: '6', itemName: '6 Second' }, { id: '8', itemName: '8 Second' },
          { id: '10', itemName: '10 Second' }
        ];
        if(step.elementEvent == '2'){
          eventTemp.id = step.elementEvent;
          eventTemp.itemName = '2 Second';
        } else if(step.elementEvent == '4'){
          eventTemp.id = step.elementEvent;
          eventTemp.itemName = '4 Second';
        } else if(step.elementEvent == '6'){
          eventTemp.id = step.elementEvent;
          eventTemp.itemName = '6 Second';
        } else if(step.elementEvent == '8'){
          eventTemp.id = step.elementEvent;
          eventTemp.itemName = '8 Second';
        } else if(step.elementEvent == '10'){
          eventTemp.id = step.elementEvent;
          eventTemp.itemName = '10 Second';
        }
      } else {
        if(step.elementEvent=='sendKey'){
          eventTemp.id = step.elementEvent;
          eventTemp.itemName = 'Input Value';
        } else if(step.elementEvent=='click'){
          eventTemp.id = step.elementEvent;
          eventTemp.itemName = 'Click';
        } else if(step.elementEvent=='windowClick'){
          eventTemp.id = step.elementEvent;
          eventTemp.itemName = 'Click Window';
        }
      }
      this.selectedEvent.push(eventTemp);
    }
    
    this.cofnigStepRequest.dataSourcePath = step.dataSourcePath;
    this.cofnigStepRequest.columnName = step.columnName;
    this.cofnigStepRequest.pattern = step.pattern;
    this.cofnigStepRequest.actionButton = step.actionButton;
    this.cofnigStepRequest.isRemoveAlphabet = step.isRemoveAlphabet;

    var classTemp:{id: any, itemName : any} = {id: '', itemName : ''};
    if(!this.Constant.EMPTY_STRINGS.includes(step.className)){
      if(step.className == 'Static'){
        classTemp.id = '1';
      } else if(step.className == 'LocationProvider'){
        classTemp.id = '2';
      } else if(step.className == 'Provider'){
        classTemp.id = '3';
      } else if(step.className == 'PracticeLocation'){
        classTemp.id = '4';
      } else if(step.className == 'ProviderProfessionalLicense'){
        classTemp.id = '5';
      } else if(step.className == 'ProviderDea'){
        classTemp.id = '6';
      } else if(step.className == 'ProviderSpecialty'){
        classTemp.id = '7';
      }  else if (step.className == 'CustomerTicket'){
        classTemp.id = '8';
      } else if(step.className == 'TicketStatusField'){
        classTemp.id = '9';
      }
      classTemp.itemName = step.className;
      this.selectedClass.push(classTemp);
      this.cofnigStepRequest.className = step.className;
    }
  }

  providerUuid: string = '';
  @ViewChild('uuidModalButton') uuidModalButton !: ElementRef;
  @ViewChild('closeSaveUuidModal') closeSaveUuidModal !: ElementRef;

  uSStates: USStates = new USStates();

  openTestModal() {
    this.ticketId =0;
    this.selectedQueue = [];
    if(this.stateList == null || this.stateList.length==0)
    this.uSStates.statesJson.forEach(state=>{
      var temp = {id: state.abbreviation, itemName : state.name};
      this.stateList.push(temp);
      this.stateList = JSON.parse(JSON.stringify(this.stateList));
    })
    this.uuidModalButton.nativeElement.click();
  }

  stateCode:string='';
  selectState(event:any){
    this.stateCode = '';
    if(event != undefined && event.length>0){
      this.invalidStateToggle = false;
      this.stateCode = event[0].id;
    }
  }

  message:string='';
  ticketId:number=0;
  queueToggle:boolean = false;
  testConfiguration() {
    debugger
    this.queueToggle = false;
    if(this.selectedQueue.length==0){
      this.queueToggle = true;
      return;
    }

    this.licenseLookupConfigRequest.queueId = this.queueId;
    this.licenseLookupConfigRequest.type = this.crawlerType;
    this.licenseLookupConfigRequest.version = this.credilyVersion;
    this.licenseLookupConfigRequest.licenseLookUpName = this.lookupName;
    this.licenseLookupConfigRequest.licenseLookUpLink = this.lookupLink;
    this.licenseLookupConfigRequest.attachmentType = this.attachmentType;
    this.licenseLookupConfigRequest.attachmentSubType = this.attachmentSubType;
    this.licenseLookupConfigRequest.lookupConfigId = this.selectedLookupConfigId;
    this.licenseLookupConfigRequest.taxonomyIdList = this.selectedTaxonomyIds;
    this.licenseLookupConfigRequest.userAccountUuid = String(localStorage.getItem(this.Constant.ACCOUNT_UUID));
    this.licenseLookupConfigRequest.configRequests = this.configurationStepList;
    this.licenseLookupConfigRequest.configRequests[this.index].subAttributeMapList = this.cofnigStepRequest.subAttributeMapList;

    this.testingConfiguration = true;
    this.isInvalidConfiguration = false;
  
    this.licenseLookupService.testConfiguration(this.licenseLookupConfigRequest, this.providerUuid, this.ticketId).subscribe(response => {
      this.testingConfiguration = false;
      if(response.status && response.message != 'Success'){
        this.message = response.message;
        setTimeout(()=>{
          this.message = '';
        },1200)
      } else {
        this.closeTestModel.nativeElement.click();
        this.dataService.showToast('Valid Configuration.', 'success');
        window.open(response.object, "_blank");
      }

    }, error => {
      this.isInvalidConfiguration = true;
      this.testingConfiguration = false;
    })
  }
  
  configstatus: string = '';
  planId:string='';
  ticketType:string='';
  rpaEndPoint:string='';
  saveConfiguration() {
    debugger
    this.savingConfiguration = true;
    this.licenseLookupConfigRequest.type = this.crawlerType;
    this.licenseLookupConfigRequest.ticketType = this.ticketType;
    this.licenseLookupConfigRequest.planId = this.planId;
    this.licenseLookupConfigRequest.lookupNames = this.selectedLookupName;
    this.licenseLookupConfigRequest.version = this.credilyVersion;
    this.licenseLookupConfigRequest.licenseLookUpName = this.lookupName;
    this.licenseLookupConfigRequest.mappedIds = this.mappedIds;
    this.licenseLookupConfigRequest.removeIds = this.unMappedIds;
    this.licenseLookupConfigRequest.attachmentType = this.attachmentType;
    this.licenseLookupConfigRequest.attactmentSource = this.attactmentSource;
    this.licenseLookupConfigRequest.attachmentSubType = this.attachmentSubType;
    this.licenseLookupConfigRequest.attachmentSubTypeDescription = this.attachmentSubTypeDescription;
    this.licenseLookupConfigRequest.licenseLookUpLink = this.lookupLink;
    this.licenseLookupConfigRequest.rpaEndPoint = this.rpaEndPoint;
    this.licenseLookupConfigRequest.testingProviderUuid = this.providerUuid;
    this.licenseLookupConfigRequest.userAccountUuid = String(localStorage.getItem(this.Constant.ACCOUNT_UUID));
    this.licenseLookupConfigRequest.configRequests = this.configurationStepList;
    this.licenseLookupConfigRequest.lookupConfigId = this.selectedLookupConfigId;
    if(this.cofnigStepRequest.subAttributeMapList.length>0){
      this.licenseLookupConfigRequest.configRequests[this.index].subAttributeMapList = this.cofnigStepRequest.subAttributeMapList;
    }
    this.licenseLookupConfigRequest.removeStepList = this.removeStepList;
    if (!this.isInvalidConfiguration) {
      if (this.selectedLookupConfigId > 0) {
        this.licenseLookupConfigRequest.configStatus = this.configstatus;
        this.licenseLookupConfigRequest.lastTestedOn = this.lastTestedOn;
        this.licenseLookupConfigRequest.screenShotUrl = this.screenShotUrl;
        this.licenseLookupConfigRequest.configReportStatus = this.configReportStatus;
        this.licenseLookupService.updateConfiguration(this.licenseLookupConfigRequest).subscribe(response => {
          this.savingConfiguration = false;
          this.dataService.showToast('Configuration Saved Successfully.');
          this.addStepToggle = false;
          this.selectedLookupConfigId = 0;
          if(this.crawlerType == this.Constant.RPA){
            this.closeTaxomonyModalButton.nativeElement.click();
          } else {
            this.closeSaveUuidModal.nativeElement.click();
          }
          this.saveRpaConfigToggle = false;
        }, error => {
          this.saveRpaConfigToggle = false;
          this.savingConfiguration = false;
          this.dataService.showToast('Something went wrong!');
        })
      } else {
        this.licenseLookupService.createConfiguration(this.licenseLookupConfigRequest).subscribe(response => {
          this.savingConfiguration = false;
          this.dataService.showToast('Configuration Saved Successfully.');
          this.addStepToggle = false;
          this.selectedLookupConfigId = 0;
          if(this.crawlerType == this.Constant.RPA){
            this.closeTaxomonyModalButton.nativeElement.click();
          } else {
            this.closeSaveUuidModal.nativeElement.click();
          }
          this.saveRpaConfigToggle = false;
        }, error => {
          this.saveRpaConfigToggle = false;
          this.savingConfiguration = false;
          this.dataService.showToast('Something went wrong!');
        })
      }
      this.getConfiguration();
    }
  }

  //--------------------------------------- Column Name Section -----------------------------------


  @ViewChild('subStructureUpdateModalCloseButton') subStructureUpdateModalCloseButton!: ElementRef;
  @ViewChild('appUpdateSubStructureModalButton') appUpdateSubStructureModalButton!: ElementRef;

  openAddStepAndCloseColumn() {
    this.selectedColumnNames = '';
    this.subStructureUpdateModalCloseButton.nativeElement.click();
    this.addConfigStepModalButton.nativeElement.click();
    // this.openAddConfigModal();
  }

  columns: { key: '', values: { isSelected: boolean, value: string, key: string, values: { isSelected: boolean, value: string, key: string, class: string }[] }[], isSelected: boolean, type: string }[] = new Array();
  loadingColumn: boolean = false;
  getPrimaryColumn(className: string) {
    debugger
    this.columns = [];
    return new Promise((res) => {
      this.loadingColumn = true;
      this.licenseLookupService.getColumnName(className).subscribe(response => {

        response.object.forEach((element: any) => {

          Object.keys(element).forEach((k: any) => {
            var obj: { key: '', values: { isSelected: boolean, value: string, key: string, values: { isSelected: boolean, value: string, key: string, class: string }[] }[], isSelected: false, type: string } = { key: '', values: [], isSelected: false, type: "string" };
            obj.key = k;
            if (element[k] instanceof Array) {
              obj.type = "array";
              element[k].forEach((element: any) => {
                var innerObj = { isSelected: false, value: element, key: '', values: [] }
                obj.values.push(innerObj);
              });

            } else {
              obj.type = element[k];
            }
            this.columns.push(obj);
          });

        });

        res(true);
        this.loadingColumn = false;
      }, error => {
        this.loadingColumn = false;
      });


    });

  }

  selectedNestedColumns: any;
  selectNestedValue(index: number, innerIndex: number, valueObj: any) {
    debugger
    this.subIndexedTab = innerIndex;
    this.selectedNestedColumns = '';
    this.selectedColumns = '';
    this.selectedNestedsubColumn = '';
    this.columns[index].values.forEach(element => {
      element.isSelected = false;
    });
    valueObj.isSelected = true;
    this.selectedNestedColumns = this.columns[index].values[innerIndex].key;
    this.subnestedClass = this.columns[index].values[innerIndex].key;
    this.indexedNestedTab = innerIndex;
    if (valueObj.type == 'object') {
      this.getPriSubNestedEntity(valueObj);
    }
  }

  indexedTab: number = -1;
  indexedNestedTab: number = -1;
  selectedColumns: any;
  flag: boolean = false;
  selectedEntity: FormStructure = new FormStructure();
  addColumnToggle: boolean = false;
  selectTab(columnObj: any, index: any) {
    debugger
    this.selectedEntity.val = "";
    
    this.selectedColumns = "";
    this.selectedNestedColumns = "";
    this.columns.forEach(element => {
      element.isSelected = false;
    });
    this.selectedColumns = this.columns[index].key;
    this.columns[index].isSelected = true;
    this.addColumnToggle = true;
    this.flag = false;
    this.indexedTab = index;

    if (columnObj.type.type == 'object') {
      this.getNestedPrimaryColumn(columnObj);
      this.nestedClassValue = columnObj.key;
    }
    if (this.columns[index].values.length == 0) {
      this.flag = true;
    }
  }

  countLoader: boolean = false;
  getNestedPrimaryColumn(dataObj: any) {
    debugger
    dataObj.values = [];
    if (dataObj.type.type == 'object') {
      this.countLoader = true;
      this.licenseLookupService.getColumnName(dataObj.type.class).subscribe(response => {

        response.object.forEach((element: any) => {

          Object.keys(element).forEach((k: any) => {
            var obj: { key: '', isSelected: false, type: string, class: string } = { key: '', isSelected: false, type: "string", class: '' };
            obj.key = k;
            obj.type = element[k].type;
            obj.class = element[k].class;
            dataObj.values.push(obj);
          });

        });
        this.countLoader = false;
        console.log(dataObj);
      }, (error) => {
        this.countLoader = false;

      });
    } 

  }

  getPriSubNestedEntity(dataObj: any) {
    debugger
    dataObj.values = [];
    if (dataObj.type == 'object') {
      this.countLoader = true;
      this.licenseLookupService.getColumnName(dataObj.class).subscribe(response => {

        response.object.forEach((element: any) => {

          Object.keys(element).forEach((k: any) => {
            var obj: { key: '', isSelected: false, type: string } = { key: '', isSelected: false, type: "string" };
            obj.key = k;
            obj.type = element[k].type;
            dataObj.values.push(obj);
          });

        });
        this.countLoader = false;
      }, (error) => {
        this.countLoader = false;

      });
    } else {
      // structureObj.secVal = dataObj.entity;
    }

  }

  subIndexedTab: any;
  selectedNestedsubColumn: any;
  selectNestedSubValue(columnId: any, nestedColumnId: any, nestedSubColumnId: any, nestedSubValueObj: any) {
    debugger
    this.columns[columnId].values[nestedColumnId].values.forEach(element => {
      element.isSelected = false;
    });
    this.selectedColumns = '';
    this.selectedNestedColumns = '';
    this.selectedNestedsubColumn = "";
    nestedSubValueObj.isSelected = true;
    this.selectedNestedsubColumn = this.columns[columnId].values[nestedColumnId].values[nestedSubColumnId].key;
  }

  selectedColumnNames: string = '';
  nestedColumnPath:string='';
  nestedClassValue: string ='';
  subnestedClass : string = '';
  addColumns() {
    debugger
    if (this.selectedColumns.length > 0) {
      this.selectedColumnNames = this.selectedColumnNames.concat(this.selectedColumns + ",");
      this.nestedColumnPath = this.selectedColumns;
    } else if (this.selectedNestedColumns.length > 0) {
      this.selectedColumnNames = this.selectedColumnNames.concat(this.selectedNestedColumns + ",");
      this.nestedColumnPath = this.nestedClassValue + '.' + this.selectedNestedColumns;
    } else {
      this.selectedColumnNames = this.selectedColumnNames.concat(this.selectedNestedsubColumn + ",");
      this.nestedColumnPath = this.nestedClassValue + '.' + this.subnestedClass + '.' + this.selectedNestedsubColumn;
    }
  }

  addCloumnNameObj() {
    debugger
    this.selectedColumnNames = this.selectedColumnNames.slice(0, -1);
    if(this.crawlerType == this.Constant.APPLICATION_FOLLOW_UP){
      this.cofnigStepRequest.columnName = this.nestedColumnPath;
    } else{
      this.cofnigStepRequest.columnName = this.selectedColumnNames;
    }
    this.openAddStepAndCloseColumn();
  }

  addSubCloumnNameObj() {
    debugger
    this.selectedColumnNames = this.selectedColumnNames.slice(0, -1);
    this.cofnigStepRequest.subAttributeMapList[this.index].columnName = this.selectedColumnNames;
    this.openAddStepAndCloseColumn();
  }


  selectedLookupConfigId: number = 0;
  lastTestedOn: any;
  screenShotUrl: any;
  configReportStatus: any;
  configId: number = 0;
  openEditModel(config: LookupConfiguration) {
    debugger
    this.removeStepList = [];
    this.planId ='';
    this.selectedTicketType = [];
    this.updateLinkToggle = false;
    this.showTaxonomyListToggle = false;
    this.mapTaxonomyToggle = false;
    this.unMappedIds = [];
    this.mappedIds = [];
    this.ticketType ='';
    this.selectedTaxonomyLink = [];
    this.selectedAttType = [];
    this.selectedAttSubType = [];

    this.configstatus = config.configStatus;
    this.lastTestedOn = config.lastTestedOn;
    this.screenShotUrl = config.url;
    this.configReportStatus = config.reportStatus;
    this.selectedLookupConfigId = config.id;
    this.lookupName = config.lookupName;
    this.lookupLink = config.lookupLink;
    this.configId = config.id;
    this.planId = config.planIds;
    this.rpaEndPoint = config.endPoint;

    if (!Constant.EMPTY_STRINGS.includes(config.attachmentType)) {
      var attType: { id: any, itemName: any } = { id: config.attachmentType, itemName: config.attachmentType };
      this.selectedAttType.push(attType);
      this.attachmentType = config.attachmentType;
    }
    if (!Constant.EMPTY_STRINGS.includes(config.attachmentSubType)) {
      var attSubType: { id: any, itemName: any } = { id: config.attachmentSubType, itemName: config.attachmentSubType };
      this.selectedAttSubType.push(attSubType);
      this.attachmentSubType = config.attachmentSubType;
    }
    if(!Constant.EMPTY_STRINGS.includes(config.ticketType)){
      var temp: { id: any, itemName: any } = { id: config.ticketType, itemName: config.ticketType };
      this.selectedTicketType.push(temp);
      this.ticketType = config.ticketType;
    }
    this.selectedTaxonomyIds = config.taxonomyId;
    this.getAttachmentType();
    this.getTaxonomyLink('');
    this.lookupModalButton.nativeElement.click();
  }

  loadingConfgurationStep: boolean = false;
  getCrawlerAttrMap(id: any) {
    this.loadingConfgurationStep = true;
    this.licenseLookupService.getCrawlerAttrMap(id).subscribe(response => {
      if (response.status && response.object != null) {
        this.configurationStepList = response.object;

        this.configurationStepList.forEach((e:any)=>{
          if(e.isStepCommented == 0){
            e.commentStepToggle = false;
          } else {
            e.commentStepToggle = true;
          }
        })

      }
      this.loadingConfgurationStep = false;
    }, error => {
      this.loadingConfgurationStep = false;
    })
  }

  @ViewChild('deleteModalButton') deleteModalButton!: ElementRef;
  deletedId: number = 0;
  deletedIndex: number = 0;
  deleteConfiguration(id: number, i: any) {
    debugger
    this.deletedId = id;
    this.deletedIndex = i;
    this.deleteModalButton.nativeElement.click();
  }

  deletingConfguration: boolean = false;
  @ViewChild('deleteCloseModalButton') deleteCloseModalButton!: ElementRef;
  confirmDeleteConfiguration() {
    debugger
    this.deletingConfguration = true;
    this.licenseLookupService.deleteConfiguration(this.deletedId).subscribe(response => {
      if (response.status) {
        this.dataService.showToast(response.message);
      }
      this.deleteCloseModalButton.nativeElement.click();
      this.getConfiguration();
      this.deletingConfguration = false;
    }, error => {
      this.deletingConfguration = false;
    })
  }

  @ViewChild('replicateModalButton') replicateModalButton!: ElementRef;
  @ViewChild('replicateModalCloseButton') replicateModalCloseButton!: ElementRef;
  replicateConfig(id: number) {
    this.selectedLookupConfigId = id;
    this.credilyVersion = '';
    this.replicateModalButton.nativeElement.click();
  }

  replicatingConfig: boolean = false;
  replicateLookupConfig() {
    this.replicatingConfig = true;
    this.licenseLookupService.replicateLookupConfig(String(localStorage.getItem(this.Constant.ACCOUNT_UUID)), this.selectedLookupConfigId).subscribe(response => {
      setTimeout(() => {
        this.replicateModalCloseButton.nativeElement.click();
      }, 500)
      this.replicatingConfig = false;
      this.getConfiguration();
    }, error => {
      this.replicatingConfig = false;
    })
  }

  ids: number[] = new Array;
  type: string = 'mapped';
  getMappedTaxonomy(type: string) {
    debugger
    this.type = type;
    if (type == 'mapped' && this.selectedTaxonomyIds.length == 0) {
      this.lookupTaxonomyList = [];
      this.totalLookupTaxonomy = 0;
      this.loadingLookupTaxonomy = false;
      return;
    }
      this.loadingLookupTaxonomy = true;
      this.licenseLookupService.getMappedTaxonomy(this.selectedTaxonomyIds, type, this.selectedStateName, this.databaseHelper).subscribe(response => {
        if (response.status) {
          this.lookupTaxonomyList = response.object.taxonomyList;
          this.totalLookupTaxonomy = response.object.totalItems;
          if (type == 'mapped') {
            this.lookupTaxonomyList.forEach(l => {
              l.checked = true;
            })
          }
        }
        this.loadingLookupTaxonomy = false;
      }, error => {
        this.loadingLookupTaxonomy = false;
      })
   
  }

  showTaxonomyListToggle: boolean = false;
  showTaxonomyDiv() {
    this.showTaxonomyListToggle = !this.showTaxonomyListToggle;
  }
  updateStatus(id: any) {
    this.licenseLookupService.updateConfigStatus(id).subscribe(response => {
      if (response.status) {
        this.dataService.showToast("Status updated Successfully ");
      }
      this.getConfiguration();
    }, error => {

    })
  }

  updateLinkToggle: boolean = false;
  oldLink: string = '';
  newLink: string = '';
  updatingLoader: boolean = false;
  switchUpdateLinkToggle() {
    this.oldLink = this.lookupLink;
    this.newLink = '';
    this.updateLinkToggle = !this.updateLinkToggle
  }

  updateLookupLink() {
    debugger
    this.updatingLoader = true;
    this.licenseLookupService.updateLookupLink(this.oldLink, this.newLink, this.lookupName).subscribe(response => {
      this.getTaxonomyLink('');
      this.getConfiguration();
      this.closeTaxomonyModalButton.nativeElement.click();
      this.updatingLoader = false;
      this.updateLinkToggle = false;
      this.lookupLink = '';
      this.selectedTaxonomyLink = [];
    }, error => {
      this.getTaxonomyLink('');
      this.updatingLoader = false;
    })
  }


  getConfigurationWithType(type: string) {
    this.crawlerType = type;
    this.getConfiguration();
  }

  attachmentTypeList: any[] = new Array()
  getAttachmentType() {
    this.licenseLookupService.getAttachmentType().subscribe(response => {
      response.forEach((e: any) => {
        var temp: { id: any, itemName: any } = { id: e.id, itemName: e.name };
        this.attTypeList.push(temp);
      })
      this.attTypeList = JSON.parse(JSON.stringify(this.attTypeList));
    }, error => {

    })
  }

  attachmentId: number = 0;
  attachmentType: string = '';
  selectAttType(event: any) {
    debugger
    this.attSubTypeList = [];
    this.attachmentSubType = '';
    this.attachmentType = '';
    if (event[0] != undefined && event.length > 0) {
      this.attachmentId = event[0].id;
      this.attachmentType = event[0].itemName;
      this.getAttachmentSubType();
    } else {
      this.selectedAttSubType =[];
    }
  }

  getAttachmentSubType() {
    this.licenseLookupService.getAttachmentSubType(this.attachmentId).subscribe(response => {
      response.forEach((e: any) => {
        var temp: { id: any, itemName: any, description: any, source: any  } = { id: e.id, itemName: e.name, description: e.description, source: e.source};
        this.attSubTypeList.push(temp);
      })
      this.attSubTypeList = JSON.parse(JSON.stringify(this.attSubTypeList));
    }, error => {

    })
  }

  attactmentSource:string='';
  attachmentSubType: string = '';
  attachmentSubTypeDescription: string = '';
  selectAttSubType(event: any) {
    debugger
    if (event[0] != undefined && event.length > 0) {
      this.attachmentSubType = event[0].itemName;
      this.attachmentSubTypeDescription = event[0].description;
      this.attactmentSource = event[0].source;
    }
  }
  addSubStep() {
    this.cofnigStepRequest.subAttributeMapList.push(new SubAttributeMap());
  }

  removeSubStep(index: number) {
    this.cofnigStepRequest.subAttributeMapList.splice(index, 1);
    this.cofnigStepRequest.subAttributeMapList[index].className = '';
    this.cofnigStepRequest.subAttributeMapList[index].columnName = '';
  }

  index: number = 0;
  subClassToggle: boolean = false;
  selectSubClassName(event: any, index: number) {
    debugger
    this.subClassToggle = false;
    this.cofnigStepRequest.subAttributeMapList[index].className = '';
    this.columnList = [];
    this.index = index;
    if (event[0] != undefined) {
      this.subClassToggle = true;
      this.cofnigStepRequest.subAttributeMapList[index].selectedClass = event;
      this.cofnigStepRequest.subAttributeMapList[index].className = event[0].itemName;
      if (this.cofnigStepRequest.subAttributeMapList[index].className.toLowerCase() != 'static') {
        this.getPrimaryColumn(this.cofnigStepRequest.subAttributeMapList[index].className);
        this.appUpdateSubStructureModalButton.nativeElement.click();
      }

    } else {
      this.columnList = [];
      this.selectedColumn = [];
    }
  }

  removeAllTax:boolean = false;
  unmapAllTaxonomy(event: any) {
    if (event.target.checked) {
      this.type = 'unmap';
      this.removeAllTax = true;
      this.licenseLookupConfigRequest.removeAll = 'yes';
      this.lookupTaxonomyList = [];
      this.mappedIds = [];
      this.selectedTaxonomyIds = [];
    }
  }

  openEditModalFromReport(){
    debugger
    if(this.configurationId>0){
      this.licenseLookupService.getConfigById(this.configurationId).subscribe(async response=>{
        if(response != null){
          this.openEditModel(response);
        }
      },error=>{

      })
    }
  }


  showCommentsToggle:boolean = false;
  showAndHideComments(){
    debugger
    this.showCommentsToggle = !this.showCommentsToggle;
    if(this.showCommentsToggle){
      this.getConfigCommentById();
    }
  }

  configCommentList : any[] = new Array();
  commentLastUpdatedDate:any;
  getConfigCommentById(){
    this.licenseLookupService.getConfigCommentById(this.selectedLookupConfigId).subscribe(response=>{
      if(response != null){
        this.configCommentList = response.list;
        this.commentLastUpdatedDate = response.lastUpdatedDate;

      }
    },error=>{

    })
  }

  queueId:string='';
  selectQueue(event:any){
    this.queueId = '';
    if(event != undefined){
      this.queueId = event[0].id;
      this.queueToggle = false;
    }
  }

  getAllTestQueue(){
    this.licenseLookupService.getAllTestQueue().subscribe(resp=>{
      this.queueList = resp;

      this.queueList = JSON.parse(JSON.stringify(this.queueList));
    },error=>{

    })
  }

  commentConfigStep(index:number){
    this.configurationStepList[index].commentUpdatingToggle = true;
    this.configurationStepList[index].commentStepToggle = !this.configurationStepList[index].commentStepToggle;
    if(this.configurationStepList[index].commentStepToggle){
      this.configurationStepList[index].isStepCommented = 1;
    } else {
      this.configurationStepList[index].isStepCommented = 0;
    }
    this.licenseLookupService.updateCommentStep(this.configurationStepList[index].licenseLookupAttrMapId).subscribe(response=>{
      this.configurationStepList[index].commentUpdatingToggle = false;
    },error=>{
      this.configurationStepList[index].commentUpdatingToggle = false;
    })
  }


  showAuditTrailToggle:boolean = false;
  auditTrailLoadingToggle:boolean = false;
  auditTrailList :AuditTrail[] = [];
  auditTrailCount:number=0;

  auditConfigName:string='';
  auditConfigLink:string='';

  auditTrailDatabaseHelper:DatabaseHelper = new DatabaseHelper();
  getAuditTrail(){
    debugger
    this.showAuditTrailToggle = true;
    this.auditTrailLoadingToggle = true;
    this.licenseLookupService.getAuditTrail(this.auditTrailDatabaseHelper.search, this.dataService.startDate, this.dataService.endDate, this.auditTrailDatabaseHelper.currentPage, this.auditTrailDatabaseHelper.itemsPerPage).subscribe(response=>{
      if(response != null){
        this.auditTrailList = response.list;
        this.auditTrailCount = response.totalAuditTrail;
      }
      this.auditTrailLoadingToggle = false;
    },error=>{
      this.auditTrailLoadingToggle = false;
    })
  }

  auditTrailPageChanged(event:any){
    this.auditTrailDatabaseHelper.currentPage = event;
    this.getAuditTrail();
  }

  logs:any[] =[];
  @ViewChild('logModelButton') logModelButton!: ElementRef;
  logsLoadingToggle:boolean = false; 
  getConfigAuditTrailLog(configName:string){
    this.logs = [];
    this.logsLoadingToggle = true;
    this.logModelButton.nativeElement.click();
    this.licenseLookupService.getConfigAuditTrailLog(configName).subscribe(response=>{
      this.logs = response;
      this.logsLoadingToggle = false;
    },error=>{
      this.logsLoadingToggle = false;
    })
  }

  rpaTestRequest: RpaTestRequest = new RpaTestRequest();
  @ViewChild('rpaTestModalButton') rpaTestModalButton!: ElementRef;
  openRpaTestModal(){
    this.rpaTestRequest = new RpaTestRequest();
    this.rpaTestModalButton.nativeElement.click();
  }

  rpaResponse:string = '';
  rpaResponseToggle:boolean = false;
  testRpaConfig(){
    this.testingConfiguration = true;
    this.rpaResponseToggle =false;
    this.rpaResponse = '';
    this.rpaTestRequest.rpaTestLink = this.rpaEndPoint;
    this.licenseLookupService.testRpaConfiguration(this.rpaTestRequest).subscribe(response=>{
      if(response == '202'){
        this.rpaResponseToggle = true;
        this.rpaResponse = 'Request accepted by RPA';
      } else {
        this.rpaResponseToggle = false;
        this.rpaResponse = 'Something went wrong!';
      }
    },error=>{
      this.rpaResponseToggle = false;
      this.rpaResponse = 'Something went wrong!';
    })
    setTimeout(() => {
      this.rpaResponse='';
      this.testingConfiguration = false;
    }, 1000);
  }

  @ViewChild('closeTestModel') closeTestModel!: ElementRef;
  savingUuidToggle:boolean = false;
  invalidUuidToggle:boolean = false;
  invalidStateToggle:boolean = false;
  saveConfigUuid(){
    this.invalidUuidToggle = false;
    this.invalidStateToggle = false;
    if(this.Constant.EMPTY_STRINGS.includes(this.providerUuid)){
      this.invalidUuidToggle = true;
      return;
    }

    if(this.Constant.EMPTY_STRINGS.includes(this.stateCode)){
      this.invalidStateToggle = true;
      return;
    }

    this.savingUuidToggle = true;
    this.licenseLookupService.saveConfigUuid(this.selectedLookupConfigId, this.providerUuid, this.stateCode).subscribe(response=>{
      if(response){
        this.closeTestModel.nativeElement.click();
        this.dataService.showToast('Save successfully', 'success');
      }
      this.savingUuidToggle = false;
    },error=>{
      this.savingUuidToggle = false;
    })
  }


  removeFirstAlphabet(event:any){
    debugger
    if(event.target.checked){
      this.cofnigStepRequest.isRemoveAlphabet = 1;
    } else {
      this.cofnigStepRequest.isRemoveAlphabet = 0;
    }
  }

  newLinkToggle:boolean = false;
  addNewLink(){
    this.newLinkToggle = !this.newLinkToggle;
  }
}
