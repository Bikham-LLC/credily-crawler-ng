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

    this.testLiveReportChange.subscribe((value) => {
      this.isLiveTestReport = value;
      console.log('Updated isLiveTestReport:', this.isLiveTestReport);
      
    });

  }

  start() { this.headerVisibilityChange.next(true); }

  done() { this.headerVisibilityChange.next(false); }

  // Find Test/Live Report
  testLiveReportChange: Subject<number> = new Subject<number>();
  startTestLiveReport(newReportValue: number) {
    // Emitting the dynamic value to the Subject
    this.testLiveReportChange.next(newReportValue);
  }

  doneTestLiveReport() {    
    // Subscribe to the testLiveReportChange Subject to listen for emitted values
    this.testLiveReportChange.subscribe((value) => {
      console.log('Received value after emission:', value);
      this.isLiveTestReport = value;  // This will update isLiveTestReport
    });
  }
}
