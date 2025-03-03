import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bulk-re-run',
  templateUrl: './bulk-re-run.component.html',
  styleUrls: ['./bulk-re-run.component.css']
})
export class BulkReRunComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  shoFilterToggle: boolean = false;
  shoFilter() {
    this.shoFilterToggle = !this.shoFilterToggle;
  }

  shoFilterTogglelicense: boolean = false;
  shoFilterlicense() {
    this.shoFilterTogglelicense = !this.shoFilterTogglelicense;
  }
  shoFilterToggleclient: boolean = false;
  shoFilterclient() {
    this.shoFilterToggleclient = !this.shoFilterToggleclient;
  }
}
