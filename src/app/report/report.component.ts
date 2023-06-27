import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  providerReport:string='provider';
  lookupConfigReport:string='lookupConfig';
  
  selectedTab:string=this.providerReport;
  switchTab(tab:string){
    this.selectedTab = tab;
  }


}
