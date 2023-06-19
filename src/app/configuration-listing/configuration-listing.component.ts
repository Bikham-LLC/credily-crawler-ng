import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LookupTaxonomyService } from '../services/lookup-taxonomy.service';
import { DataService } from '../services/data.service';
import { LookupConfiguration } from '../models/LookupConfiguration';
import { DatabaseHelper } from '../models/DatabaseHelper';

@Component({
  selector: 'app-configuration-listing',
  templateUrl: './configuration-listing.component.html',
  styleUrls: ['./configuration-listing.component.css']
})
export class ConfigurationListingComponent implements OnInit {

  constructor(private lookupTaxonomyService:LookupTaxonomyService,
    private dataService:DataService) { }
 
  ngOnInit(): void {
    this.getConfiguration();
  }

  loadingConfiguration:boolean=true;
  configList:LookupConfiguration[] = new Array();
  totalConfiguration:number=0;
  databaseHelper:DatabaseHelper = new DatabaseHelper();
  getConfiguration(){
    this.loadingConfiguration = true;
    this.lookupTaxonomyService.getConfiguration(this.databaseHelper).subscribe(response=>{
      if(response.status && response.object!=null){
        this.configList = response.object;
        this.totalConfiguration = response.totalItems;
      }
      this.loadingConfiguration = false;
    },error=>{
      this.loadingConfiguration = false;
      this.dataService.showToast(error.error);
    })
  }

  pageChanged(event: any) {
    if (event != this.databaseHelper.currentPage) {
      this.databaseHelper.currentPage = event;
      this.getConfiguration();
    }
  }

}
