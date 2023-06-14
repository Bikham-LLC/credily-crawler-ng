import { Injectable } from '@angular/core';
declare var Toastnotify: any;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  showToast(msg: any, type = 'dark') {
    Toastnotify.create({
      text: msg,
      type: type,
      duration: 5000,
    });
  }
}
