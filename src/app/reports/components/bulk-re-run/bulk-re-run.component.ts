import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { debounce, set } from 'lodash';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Constant } from 'src/app/models/Constant';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { Route } from 'src/app/models/Route';
import { DataService } from 'src/app/services/data.service';
import { HeaderSubscriptionService } from 'src/app/services/header-subscription.service';
import { ReportService } from 'src/app/services/report.service';

@Component({
  selector: 'app-bulk-re-run',
  templateUrl: './bulk-re-run.component.html',
  styleUrls: ['./bulk-re-run.component.css']
})
export class BulkReRunComponent implements OnInit {
  readonly Constant = Constant;

  databaseHelper: DatabaseHelper = new DatabaseHelper();
  sourceList: any;
  clientList: any;
  licenseList: any;
  providerList: any;
  search = new Subject<string>();

  cSearch = new Subject<string>();
  pSearch = new Subject<string>();
  lSearch = new Subject<string>();

  fetchingReport: boolean = false;

  constructor(private reportService: ReportService,
    private dataService: DataService,
    private router: Router,
    private headerSubscription: HeaderSubscriptionService
  ) {

    this.search.pipe(
      debounceTime(600))
      .subscribe(value => {
        this.databaseHelper.currentPage = 1;
        this.refreshData();
      });

    this.subscribeHeader = this.headerSubscription.headerVisibilityChange.subscribe(async (value) => {
      debugger
      if (router.url == Route.BULK_RERUN_MODULE) {

        this.selectedItemList = [];
        this.appliedFilters = [];
        this.resetCLPSFilters();
        this.updateAppliedFilters();
        this.refreshData();
      }
      console.log('In constructor - ' + this.subscribeHeader?.destination?.closed)
    })
  }

  subscribeHeader: any

  ngOnInit(): void {
    this.getDistinctClients();
    this.getDistinctLicenses();
    this.getDistinctProviders();
    this.refreshData();
  }

  shoFilterToggleProvider: boolean = false;
  shoFilterProvider() {
    this.shoFilterToggleProvider = !this.shoFilterToggleProvider;
  }

  shoFilterTogglelicense: boolean = false;
  shoFilterlicense() {
    this.shoFilterTogglelicense = !this.shoFilterTogglelicense;
  }
  shoFilterToggleclient: boolean = false;
  shoFilterclient() {
    this.shoFilterToggleclient = !this.shoFilterToggleclient;
  }
  shoFilterToggleSource: boolean = false;
  shoFilterSource() {
    this.shoFilterToggleSource = !this.shoFilterToggleSource;
  }

  allChecked: boolean = false;
  selectedItemList: number[] = new Array();

  // onSelectAll(event: Event){
  //   const checked = (event.target as HTMLInputElement).checked
  //   this.allChecked = checked;
  //   if (checked) {
  //     this.selectedItemList = new Set(this.providerCrawlerIdList);
  //   } else {
  //     this.selectedItemList.clear();
  //   }
  // }

  onSelectPage(event: Event) {
    debugger
    const checked = (event.target as HTMLInputElement).checked
    this.allChecked = checked;
    this.crawlerLogList.forEach(item => {
      item.selected = checked;
      if (checked) {
        let logId = Number(item.crawlerLogId);
        if (!this.selectedItemList.includes(logId)) {
          this.selectedItemList.push(logId);
        }
      } else {
        let index = this.selectedItemList.findIndex(x => x == item.crawlerLogId);
        if (index > -1) {
          this.selectedItemList.splice(index, 1);
        }
      }
    });
    console.log("selected items", this.selectedItemList)
  }

  onSelectRow(event: Event, item: any) {
    const checked = (event.target as HTMLInputElement).checked;
    item.selected = checked;
    if (checked) {
      let logId = Number(item.crawlerLogId);
      if (!this.selectedItemList.includes(logId)) {
        this.selectedItemList.push(logId);
      }
    } else {
      let crawlerLogIndex = this.selectedItemList.findIndex(x => x == item.crawlerLogId);
      if (crawlerLogIndex > -1) {
        this.selectedItemList.splice(crawlerLogIndex, 1);
      }
    }
    this.allChecked = this.crawlerLogList.every(i => i.selected);
    console.log("selected items", this.selectedItemList)
  }
  onSelectAll() {
    this.allChecked = true;
    this.selectedItemList = this.providerCrawlerIdList;
    this.crawlerLogList.forEach((e: any) => {
      e.selected = true;
    });
    console.log("selected items", this.selectedItemList)

  }

  clearSelection() {
    this.allChecked = false;
    this.crawlerLogList.forEach((e: any) => {
      e.selected = false;
    });
    this.selectedItemList = [];
  }

  crawlerLogList: any[] = new Array();
  getProviderCrawlerlog(isPageChange: number) {
    this.fetchingReport = true;
    // this.databaseHelper.currentPage = 1;
    this.databaseHelper.currentPage = this.p;
    if (!this.pageToggle) {
      this.p = 1;
      this.databaseHelper.currentPage = this.p;
    }

//  this.crawlerLogList = [];
    this.reportService.getReRunProviderReport(this.databaseHelper, this.dataService.startDate, this.dataService.endDate,
      this.sourceList, this.licenseList, this.clientList, this.providerList, this.dataService.isLiveAccount).subscribe((res: any) => {
        this.pageToggle =  false;
        this.crawlerLogList = res;

        this.crawlerLogList.forEach(item => {
          let tempId = Number(item.crawlerLogId);
          if (!Number.isNaN(tempId)) {
            if (this.selectedItemList.includes(tempId)) {
              item.selected = true;
            };
          }
        });
        this.allChecked = this.crawlerLogList.every(i => i.selected);
        this.fetchingReport = false;
      }, error => {
        this.fetchingReport = false
      });
  }

  crawlerLogTotalCount: any
  getPoviderCrawlerLogCount() {
    this.reportService.getReRunProviderReportCount(this.databaseHelper, this.dataService.startDate, this.dataService.endDate,
      this.sourceList, this.licenseList, this.clientList, this.providerList, this.dataService.isLiveAccount).subscribe((res: any) => {
        this.crawlerLogTotalCount = res;
      })
  }

  providerCrawlerIdList: number[] = new Array();
  getAllProviderCrawlerId() {
    this.reportService.getAllReRunProviderId(this.databaseHelper, this.dataService.startDate, this.dataService.endDate,
      this.sourceList, this.licenseList, this.clientList, this.providerList, this.dataService.isLiveAccount).subscribe((res: any) => {
        this.providerCrawlerIdList = res;
      })
  }

  // getByDate(){
  //   this.providerList=[];
  //   suhgfsiue="";
  //   getList();
  // }
  p: number = 1;
  pageToggle: boolean = false
  pageChanged(event: any) {
    this.pageToggle = true;
    this.databaseHelper.currentPage = event;
    this.p = event;
    this.getProviderCrawlerlog(1)
  }

  distinctClients: Set<string> = new Set();
  distinctLicenses: Set<string> = new Set();
  distinctProviders: Set<string> = new Set();

  clientSearch: any
  providerSearch: any
  licenseSearch: any

  getDistinctClients() {
    debugger
    this.reportService.getDistinctClients(this.clientSearch).subscribe((res: any) => {
      this.distinctClients = new Set(res);
    })
  }

  getDistinctLicenses() {
    this.reportService.getDistinctLicenses(this.licenseSearch).subscribe((res: any) => {
      this.distinctLicenses = new Set(res);
    })
  }

  getDistinctProviders() {
    this.reportService.getDistinctProviders(this.providerSearch).subscribe((res: any) => {
      this.distinctProviders = new Set(res);
    })
  }

  selectedClients: Set<string> = new Set();
  allClientChecked: boolean = false
  allLicenseChecked: boolean = false
  allProviderChecked: boolean = false
  onSelectCLient(event: Event, client: string) {
    debugger
    const checked = (event.target as HTMLInputElement).checked;
    this.allClientChecked = true
    if (checked) {
      this.selectedClients.add(client);
    } else {
      this.selectedClients.delete(client);
    }

    if (this.selectedClients.size < this.distinctClients.size) {
      this.allClientChecked = false;
    }
  }

  selectAllClients(event: Event) {
    debugger
    const checked = (event.target as HTMLInputElement).checked;
    this.allClientChecked = true;

    if (checked) {
      this.selectedClients = new Set(this.distinctClients);
    } else {
      this.selectedClients.clear();
    }
  }

  selectedLicenses: Set<string> = new Set();
  onSelectLicense(event: Event, license: string) {
    const checked = (event.target as HTMLInputElement).checked;
    this.allLicenseChecked = true
    if (checked) {
      this.selectedLicenses.add(license);
    } else {
      this.selectedLicenses.delete(license);
    }
    if (this.selectedLicenses.size < this.distinctLicenses.size) {
      this.allLicenseChecked = false;
    }
  }

  selectAllLicesnse(event: Event) {
    debugger
    const checked = (event.target as HTMLInputElement).checked;
    this.allLicenseChecked = true;

    if (checked) {
      this.selectedLicenses = new Set(this.distinctLicenses);
    } else {
      this.selectedLicenses.clear();
    }
  }

  selectedProviders: Set<string> = new Set();
  onSelectProvider(event: Event, provider: string) {
    const checked = (event.target as HTMLInputElement).checked;
    this.allProviderChecked = true;
    if (checked) {
      this.selectedProviders.add(provider);
    } else {
      this.selectedProviders.delete(provider);
    }

    if (this.selectedProviders.size < this.distinctProviders.size) {
      this.allProviderChecked = false;
    }
  }

  selectAllProvider(event: Event) {
    debugger
    const checked = (event.target as HTMLInputElement).checked;
    this.allProviderChecked = true;

    if (checked) {
      this.selectedProviders = new Set(this.distinctProviders);
    } else {
      this.selectedProviders.clear();
    }
  }

  selectedSources: Set<string> = new Set();
  onSelectSource(event: Event, source: string) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedSources.add(source);
    } else {
      this.selectedSources.delete(source);
    }
  }

  // onSelectAllClient(event: Event){
  //   const checked = (event.target as HTMLInputElement).checked
  //   if(checked){
  //     this.selectedClients = new set(this.distinctClients);
  //   }
  // }


  refreshData() {
    this.getProviderCrawlerlog(0);
    this.getAllProviderCrawlerId();
    this.getPoviderCrawlerLogCount();
  }

  appliedFilters: string[] = [];


  updateAppliedFilters() {
    this.appliedFilters = [
      ...Array.from(this.selectedClients).map(client => `C: ${client}`),
      ...Array.from(this.selectedLicenses).map(license => `L: ${license}`),
      ...Array.from(this.selectedProviders).map(provider => `P: ${provider}`),
      ...Array.from(this.selectedSources).map(source => `S: ${source}`)
    ];
  }

  removeFilter(filter: string) {
    if (filter.startsWith("C: ")) {
      const client = filter.replace("C: ", "");
      this.selectedClients.delete(client);
      this.clientList = Array.from(this.selectedClients);
    } else if (filter.startsWith("L: ")) {
      const license = filter.replace("L: ", "");
      this.selectedLicenses.delete(license);
      this.licenseList = Array.from(this.selectedLicenses);
    } else if (filter.startsWith("P: ")) {
      const provider = filter.replace("P: ", "");
      this.selectedProviders.delete(provider);
      this.providerList = Array.from(this.selectedProviders);
    } else if (filter.startsWith("S: ")) {
      const source = filter.replace("S: ", "");
      this.selectedSources.delete(source);
      this.sourceList = Array.from(this.selectedSources);
    }

    this.updateAppliedFilters();
    this.refreshData();
  }

  applyCLientFilter() {
    this.clientList = Array.from(this.selectedClients);
    this.updateAppliedFilters();
    this.refreshData();
    this.shoFilterToggleclient = !this.shoFilterToggleclient;
  }

  resetClientFilter() {
    this.selectedClients.clear();
    this.clientList = [];
    this.allClientChecked = false;
    this.updateAppliedFilters();
    this.refreshData();
  }

  clearClientSearch() {
    this.clientSearch = '';
    this.getDistinctClients();
  }

  applyLicenseFilter() {
    this.licenseList = Array.from(this.selectedLicenses);
    this.updateAppliedFilters();
    this.refreshData();
    this.shoFilterTogglelicense = !this.shoFilterTogglelicense;
  }

  resetLicenseFilter() {
    this.selectedLicenses.clear();
    this.licenseList = [];
    this.allLicenseChecked = false;
    this.updateAppliedFilters();
    this.refreshData();
  }

  clearLicenseSearch() {
    this.licenseSearch = '';
    this.getDistinctLicenses();
  }

  applyProviderFilter() {
    this.providerList = Array.from(this.selectedProviders);
    this.updateAppliedFilters();
    this.refreshData();
    this.shoFilterToggleProvider = !this.shoFilterToggleProvider;
  }

  resetProviderFilter() {
    this.selectedProviders.clear();
    this.providerList = [];
    this.allProviderChecked = false;
    this.updateAppliedFilters();
    this.refreshData();
  }

  clearProviderSearch() {
    this.providerSearch = '';
    this.getDistinctProviders();
  }

  applySourceFilter() {
    this.sourceList = Array.from(this.selectedSources);
    this.updateAppliedFilters();
    this.refreshData();
    this.shoFilterToggleSource = !this.shoFilterToggleSource;
  }

  resetSourceFilter() {
    this.selectedSources.clear();
    this.sourceList = [];
    this.updateAppliedFilters();
    this.refreshData();
  }

  resetCLPSFilters() {
    this.selectedClients = new Set<string>();
    this.selectedProviders = new Set<string>();
    this.selectedLicenses = new Set<string>();
    this.selectedSources = new Set<string>();
    this.clientList = [];
    this.providerList = [];
    this.licenseList = [];
    this.sourceList = [];
    this.updateAppliedFilters();
    this.refreshData();
  }

  // isbulkRunDisable= true

  isBulkReRunLoading: boolean = false;
  bulkReRunProvider() {
    this.isBulkReRunLoading = true;

    const logIds = Array.from(this.selectedItemList);
    this.reportService.bulkReRunProviderLog(logIds).subscribe(res => {
      this.isBulkReRunLoading = false
      if (res.status && res.message == null) {
        console.log(`Bulk re-run successful for log IDs: ${logIds.join(", ")}`);
      } else {
        console.error(`Bulk re-run failed`);
      }
      this.refreshData();
      this.selectedItemList = [];
    })
  }

  logId: number = 0;
  isSingleReRunLoading = false
  singleReRunProvider(logId: number) {
    this.isSingleReRunLoading = true
    this.logId = logId;
    this.reportService.bulkReRunProviderLog([logId]).subscribe(res => {
      this.isSingleReRunLoading = false
      if (res.status && res.message == null) {
        console.log(`re-run successful for log ID: ${logId}`);
      } else {
        console.error(`re-run failed`);
      }
      this.refreshData();
    })
  }

  clearSearch() {
    this.databaseHelper.search = '';
    this.search.next('');
  }

  // @ViewChild('closeLogsButton') closeLogsButton!:ElementRef;
  // closeLogModel(){
  //   this.closeLogsButton.nativeElement.click();
  // }
  
  @ViewChild('openSnapshotModalButton') openSnapshotModalButton !: ElementRef;
  imageUrl:string='';
  imageLoadingToggle:boolean = false;
  imageName:string='';
  imageExtension:string='';
  viewSnapshot(url:string, imageName:string){
    debugger
    // this.handleRenderPdf();
    this.imageName = imageName;
    this.imageLoadingToggle = true;
    this.imageUrl = url;
    this.imageExtension = this.getFileExtension(url);
    this.openSnapshotModalButton.nativeElement.click();

    console.log("Ext: ",this.imageExtension)

    // this.closeLogsButton.nativeElement.click();
    setTimeout(()=>{
      this.imageLoadingToggle = false;
    },1000)
    // this.openSnapshotModalButton.nativeElement.click();
  }

  getFileExtension(url: string): string {
    const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    return match ? match[1] : '';
  }

  @ViewChild('closeSnapshotModalButton') closeSnapshotModalButton !: ElementRef;
  closeSnapshotModal(){
    this.closeSnapshotModalButton.nativeElement.click();
    // this.viewLogsButton.nativeElement.click();
  }
}
