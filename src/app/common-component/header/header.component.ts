import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constant } from '../../models/Constant';
import { Route } from 'src/app/models/Route';
import * as moment from 'moment';
import { DataService } from 'src/app/services/data.service';
import { HeaderSubscriptionService } from 'src/app/services/header-subscription.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public _router: Router,
    public dataService: DataService,
    public router: Router,
    private headerSubscriptionService: HeaderSubscriptionService) {
    if(!this.Constant.EMPTY_STRINGS.includes(localStorage.getItem(this.Constant.USER_NAME))){
      this.userName = String(localStorage.getItem(this.Constant.USER_NAME));
    }
   }

   readonly Constant = Constant;
   readonly Route = Route;
   userName:string='Logged In';

  ngOnInit(): void {
   
  }


  logOut() {
    localStorage.clear();
    this._router.navigate(['/auth/login']);
  }


  selectDateFilter(event: any) {
    debugger
    if(event==null && this.router.url === Route.BULK_RERUN_MODULE){
      this.dataService.startDate=null;
      this.dataService.endDate =null;
      this.dataService.selected = null as any;
    }
    else if (this.dataService.selected != undefined && this.dataService.selected != null && this.dataService.selected.startDate != undefined && this.dataService.selected.endDate != undefined && this.dataService.selected != null && this.dataService.selected.startDate != null ) {
      this.dataService.startDate = new Date(this.dataService.selected.startDate.toDate()).toDateString();
      this.dataService.endDate = new Date(this.dataService.selected.endDate.toDate()).toDateString();
      
    }
    this.headerSubscriptionService.start();
  }

  dataList: any[] = [
    { id: -1, name: 'All' },
    { id: 1, name: 'Live Account' },
    { id: 0, name: 'Test Account' }
  ];


  dropdownSettings = {
    singleSelection: true, 
    primaryKey: 'id',
    labelKey: 'name'
  };

  onSelectionChange(event: any) {
    debugger
    if(event != undefined && event.length >0){ 
      this.dataService.isLiveAccount = event[0].id
    } else {
      var temp = {id: -1, name: 'All'}
      this.dataService.selectedOptions.push(temp);
      this.dataService.isLiveAccount = -1
    }
    this.headerSubscriptionService.start();
  }

}
