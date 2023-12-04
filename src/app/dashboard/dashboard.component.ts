import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constant } from '../models/Constant';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private _router: Router) {
    if(!this.Constant.EMPTY_STRINGS.includes(localStorage.getItem(this.Constant.USER_NAME))){
      this.userName = String(localStorage.getItem(this.Constant.USER_NAME));
    }
   }

   readonly Constant = Constant;
   userName:string='Logged In';

  ngOnInit(): void {
  }


  logOut() {
    localStorage.clear();
    this._router.navigate(['/auth/login']);
  }

}
