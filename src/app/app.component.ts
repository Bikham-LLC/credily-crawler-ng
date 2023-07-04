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

  constructor(private router: Router) { 
    if(Constant.EMPTY_STRINGS.includes(localStorage.getItem(Constant.TOKEN))){
      localStorage.clear();
      this.router.navigate(['/auth/login']);
    }
  }

}
