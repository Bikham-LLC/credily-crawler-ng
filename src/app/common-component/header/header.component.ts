import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constant } from '../../models/Constant';
import { Route } from 'src/app/models/Route';
import * as moment from 'moment';
import { DataService } from 'src/app/services/data.service';
import { HeaderSubscriptionService } from 'src/app/services/header-subscription.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public _router: Router,
    public dataService: DataService,
    private router: Router,
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
    if (this.dataService.selected != undefined && this.dataService.selected != null && this.dataService.selected.startDate != undefined && this.dataService.selected.endDate != undefined && this.dataService.selected != null) {
      this.dataService.startDate = new Date(this.dataService.selected.startDate.toDate()).toDateString();
      this.dataService.endDate = new Date(this.dataService.selected.endDate.toDate()).toDateString();
    }
    this.headerSubscriptionService.start();
  }

}
