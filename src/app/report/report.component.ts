import { Component, OnInit } from '@angular/core';
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

  ngOnInit(): void {
    this.getConfiguration();
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
    this.lookupTaxonomyService.getConfiguration(this.configDatabaseHelper).subscribe(response => {
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

}
