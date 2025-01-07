import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderSubscriptionService {
  
  header: boolean=false;
  isLiveTestReport: number = -1;
  headerVisibilityChange: Subject<boolean> = new Subject<boolean>();
  constructor() { 
    this.headerVisibilityChange.subscribe((value) => {
      this.header = value;
    });

  }

  start() { this.headerVisibilityChange.next(true); }

  done() { this.headerVisibilityChange.next(false); }

}
