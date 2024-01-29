import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constant } from '../models/Constant';
import { DashboardService } from '../services/dashboard-service';
import { DatabaseHelper } from '../models/DatabaseHelper';
import { DashboardV2ConfigDataList } from '../models/DashboardV2ConfigDataList';
import { DashboardV3ConfigDataList } from '../models/DashboardV3ConfigDataList';

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
    this.getConfigDataV2('License Lookup');
    this.getConfigDataV3('License Lookup');
  }

  logOut() {
    localStorage.clear();
    this._router.navigate(['/auth/login']);
  }

  dashboardTotalCountsV2 : DashboardV2ConfigDataList = new DashboardV2ConfigDataList();
  dashboardTotalCountsV3 : DashboardV3ConfigDataList = new DashboardV3ConfigDataList();

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


  dashboardV2ConfigDataList : DashboardV2ConfigDataList[] = new Array();
  dashboardV3ConfigDataList : DashboardV3ConfigDataList[] = new Array();
  dashboardCountDataV2 : number =0;
  dashboardCountDataV3 : number =0;
  v2ConfigLoadingToggle:boolean = false;
  v3ConfigLoadingToggle:boolean = false;
  databaseHelper:DatabaseHelper = new DatabaseHelper();
  v2configType:string='';
  v3configType:string='';
  getConfigDataV2(type:string){
    debugger
    this.v2ConfigLoadingToggle = true;
    this.v2configType = type;
    this.dashboardService.getConfigDataByLogs(type, 'V2', this.V2DatabaseHelper.currentPage, this.V2DatabaseHelper.itemsPerPage).subscribe(response=>{
      if(response.status){
        this.dashboardV2ConfigDataList = response.object;
        this.dashboardCountDataV2 = response.totalItems;
        this.v2ConfigLoadingToggle = false;
      }
    },error=>{
      this.v2ConfigLoadingToggle = false;
    })
  }

  getConfigDataV3(type:string){
    debugger
    this.v3ConfigLoadingToggle = true;
    this.v3configType = type;
    this.dashboardService.getConfigDataByLogs(type, 'V3', this.v3DatabaseHelper.currentPage, this.v3DatabaseHelper.itemsPerPage).subscribe(response=>{
      if(response.status){
        this.dashboardV3ConfigDataList = response.object;
        this.dashboardCountDataV3 = response.totalItems;
        this.v3ConfigLoadingToggle = false;
      }
    },error=>{
      this.v3ConfigLoadingToggle = false;
    })
  }

  V2DatabaseHelper:DatabaseHelper = new DatabaseHelper();
  pageChanged(event:any){
    debugger
    if(event != undefined){
      this.V2DatabaseHelper.currentPage = event;
      this.getConfigDataV2(this.v2configType);
    }
  }

  v3DatabaseHelper:DatabaseHelper = new DatabaseHelper();
  pageChangedforV3(event:any){
    debugger
    if(event != undefined){
      this.v3DatabaseHelper.currentPage = event;
      this.getConfigDataV3(this.v3configType);
    }
  }

}
