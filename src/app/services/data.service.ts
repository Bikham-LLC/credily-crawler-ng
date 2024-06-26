import { Injectable } from '@angular/core';
import { Constant } from '../models/Constant';
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
}
