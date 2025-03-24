import { Injectable } from '@angular/core';
import { Constant } from '../models/Constant';
import * as moment from 'moment';
import { HeaderComponent } from '../common-component/header/header.component';
declare var Toastnotify: any;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  readonly Constant = Constant;

  constructor() { }

  showToast(msg: any, type = 'dark', duration = 5000) {
    Toastnotify.create({
      text: msg,
      type: type,
      duration: duration,
    });
  }


  getNameInTitleCase(value:any){
    let newValue;
    if(!this.Constant.EMPTY_STRINGS.includes(value)){
      newValue = value.split(" ").map((l: string) => l[0].toUpperCase() + l.substr(1).toLowerCase()).join(" ");
      newValue = newValue.replaceAll(" ", "");
    }
    return newValue;
  }

  selected : { startDate: moment.Moment, endDate: moment.Moment } = {startDate:moment().subtract(1, 'day'), endDate: moment()};
  startDate: any = new Date(this.selected.startDate.toDate()).toDateString();
  endDate: any = new Date(this.selected.endDate.toDate()).toDateString();

  clearDateRange(){
    this.startDate = null;
    this.endDate = null;
    this.selected ={startDate :  this.startDate, endDate :  this.endDate};
  }

  isLiveAccount: number = 1;
  selectedOptions: any[] = [{ id: 1, name: 'Live Account' }];

}


