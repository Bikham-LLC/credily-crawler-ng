import { Injectable } from '@angular/core';
declare var Toastnotify: any;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  showToast(msg: any, type = 'dark', duration = 5000) {
    Toastnotify.create({
      text: msg,
      type: type,
      duration: duration,
    });
  }
}
