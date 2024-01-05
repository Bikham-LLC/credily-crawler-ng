import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constant } from '../models/Constant';
import { DashboardService } from '../services/dashboard-service';
import { DashboardTotalProviderDataV2 } from '../models/DashboardTotalProviderDataV2';
import { DashboardTotalProviderDataV3 } from '../models/DashboardTotalProviderDataV3';
import { DatabaseHelper } from '../models/DatabaseHelper';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private _router: Router,
    private dashboardService: DashboardService) {
    if(!this.Constant.EMPTY_STRINGS.includes(localStorage.getItem(this.Constant.USER_NAME))){
      this.userName = String(localStorage.getItem(this.Constant.USER_NAME));
    }
   }

   readonly Constant = Constant;
   userName:string='Logged In';

  ngOnInit(): void {
    this.getTotoalProvidersData('License Lookup', 'V2');
    this.getTotoalProvidersData('License Lookup', 'V3');
    this.getConfigDataByLogs('License Lookup', 'V2');
    this.getConfigDataByLogs('License Lookup', 'V3');
  }

  logOut() {
    localStorage.clear();
    this._router.navigate(['/auth/login']);
  }

  dashboardTotalCountsV2 : DashboardTotalProviderDataV2 = new DashboardTotalProviderDataV2();
  dashboardTotalCountsV3 : DashboardTotalProviderDataV3 = new DashboardTotalProviderDataV3();

  v2TotalCountsLoadingToggle:boolean = false;
  v3TotalCountsLoadingToggle:boolean = false;
  getTotoalProvidersData(type:string, version:string){
    if(version=='V3'){
      this.v3TotalCountsLoadingToggle = true;
    }else if (version = 'V2'){
      this.v2TotalCountsLoadingToggle = true;
    }
    this.dashboardService.getTotoalProvidersData(type, version).subscribe(response=>{
      if(version=='V3'){
        this.dashboardTotalCountsV3 = response;
        this.v3TotalCountsLoadingToggle = false;
      }else{
        this.dashboardTotalCountsV2 = response;
        this.v2TotalCountsLoadingToggle = false;
      }
    },error=>{
      this.v2TotalCountsLoadingToggle = false;
      this.v3TotalCountsLoadingToggle = false;
    })
  }


  dashboardTotalProviderDataV2 : DashboardTotalProviderDataV2[] = new Array();
  dashboardTotalProviderDataV3 : DashboardTotalProviderDataV3[] = new Array();
  v2ConfigLoadingToggle:boolean = false;
  v3ConfigLoadingToggle:boolean = false;
  databaseHelper:DatabaseHelper = new DatabaseHelper();
  getConfigDataByLogs(type:string, version:string){
    if(version=='V3'){
      this.v3ConfigLoadingToggle = true;
    }else if (version = 'V2'){
      this.v2ConfigLoadingToggle = true;
    }
    this.dashboardService.getConfigDataByLogs(type, version, this.databaseHelper.currentPage, this.databaseHelper.itemsPerPage).subscribe(response=>{
      if(version=='V3'){
        this.dashboardTotalProviderDataV3 = response;
        this.v3ConfigLoadingToggle = false;
      }else{
        this.dashboardTotalProviderDataV2 = response;
        this.v2ConfigLoadingToggle = false;
      }
    },error=>{
      this.v2ConfigLoadingToggle = false;
      this.v3ConfigLoadingToggle = false;
    })
  }

}
