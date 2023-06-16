import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Keys } from '../models/key';
import { Observable } from 'rxjs';
import { DatabaseHelper } from '../models/DatabaseHelper';
import { LicenseLookupConfigRequest } from '../models/LicenseLookupConfigRequest';

@Injectable({
  providedIn: 'root'
})
export class LookupTaxonomyService {

  constructor(private http: HttpClient) { }

  key: Keys = new Keys();

  getLookupTaxonomy(databaseHelper:DatabaseHelper): Observable<any> {
    if(databaseHelper==undefined || databaseHelper==null){
      databaseHelper = new DatabaseHelper();
    }
    const params = new HttpParams()
    .set('search', databaseHelper.search)
    .set('searchBy', databaseHelper.searchBy)
    .set('currentPage', databaseHelper.currentPage)
    .set('itemsPerPage', databaseHelper.itemsPerPage)

    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_taxonomy, {params});
  }

  createConfiguration(config:LicenseLookupConfigRequest): Observable<any> {
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller, config);
  }

}
