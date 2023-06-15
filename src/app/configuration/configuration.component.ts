import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseHelper } from '../models/DatabaseHelper';
import { LookupTaxonomy } from '../models/LookupTaxonomy';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  constructor(private _router: Router) { }

  databaseHelper:DatabaseHelper = new DatabaseHelper();
  lookupTaxonomyList:LookupTaxonomy[] = new Array();
  totalLookupTaxonomy : number = 20;

  ngOnInit(): void {
  }

  logOut() {
    localStorage.clear();
    this._router.navigate(['/auth/login']);
  }

  pageChanged(event: any) {
    if (event != this.databaseHelper.currentPage) {
      this.databaseHelper.currentPage = event;
      // this.getAllProvider();
    }
  }

}
