import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseHelper } from '../models/DatabaseHelper';
import { LookupTaxonomy } from '../models/LookupTaxonomy';
import { LookupTaxonomyService } from '../services/lookup-taxonomy.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  constructor(private _router: Router,
    private lookupTaxonomyService:LookupTaxonomyService,
    private dataService:DataService) { }

  databaseHelper:DatabaseHelper = new DatabaseHelper();
  lookupTaxonomyList:LookupTaxonomy[] = new Array();
  totalLookupTaxonomy : number = 20;
  loadingLookupTaxonomy:boolean = false;

  ngOnInit(): void {
  }

  logOut() {
    localStorage.clear();
    this._router.navigate(['/auth/login']);
  }

  getLookupTaxonomyMap(){
    this.loadingLookupTaxonomy = true;
    this.lookupTaxonomyService.getLookupTaxonomyMap(this.databaseHelper).subscribe(resp=>{

      this.loadingLookupTaxonomy = false;
    },error=>{
      this.loadingLookupTaxonomy = false;
      this.dataService.showToast(error.error);
    })
  }

  pageChanged(event: any) {
    if (event != this.databaseHelper.currentPage) {
      this.databaseHelper.currentPage = event;
      this.getLookupTaxonomyMap();
    }
  }

}
