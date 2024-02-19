import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Constant } from './models/Constant';
// import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'licenselooktool';

  readonly Constant = Constant;
  constructor(private router: Router) { 
    if(Constant.EMPTY_STRINGS.includes(localStorage.getItem(Constant.TOKEN))){
      localStorage.clear();
      this.router.navigate(['/auth/login']);
    }
    
  }

  ngOnInit(){
    this.showHeader();
  }

  accountUuid:any;
  showHeader(){
    if(!Constant.EMPTY_STRINGS.includes(localStorage.getItem(Constant.ACCOUNT_UUID))){
      this.accountUuid = localStorage.getItem(Constant.ACCOUNT_UUID);
    }
  }

}
