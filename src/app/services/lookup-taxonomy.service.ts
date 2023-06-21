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

  getLookupTaxonomy(databaseHelper:DatabaseHelper, state:string): Observable<any> {
    if(databaseHelper==undefined || databaseHelper==null){
      databaseHelper = new DatabaseHelper();
    }
    const params = new HttpParams()
    .set('state', state)
    .set('search', databaseHelper.search)
    .set('searchBy', databaseHelper.searchBy)
    .set('currentPage', databaseHelper.currentPage)
    .set('itemsPerPage', databaseHelper.itemsPerPage)

    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_taxonomy, {params});
  }

  testConfiguration(config:LicenseLookupConfigRequest, providerUuid:string): Observable<any> {
    const params = new HttpParams()
    .set('providerUuid', providerUuid)
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.crewler_controller, config, {params});
  }

  createConfiguration(config:LicenseLookupConfigRequest): Observable<any> {
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller, config);
  }

  updateConfiguration(config:LicenseLookupConfigRequest): Observable<any> {
    return this.http.patch<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller, config);
  }

  getConfiguration(databaseHelper:DatabaseHelper): Observable<any> {
    if(databaseHelper==undefined || databaseHelper==null){
      databaseHelper = new DatabaseHelper();
    }
    const params = new HttpParams()
    .set('search', databaseHelper.search)
    .set('searchBy', databaseHelper.searchBy)
    .set('currentPage', databaseHelper.currentPage)
    .set('itemsPerPage', databaseHelper.itemsPerPage)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+'/lookup');
  }

  getCrawlerAttribute(): Observable<any> {
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_crawler_attribute);
  }

  getClassName(): Observable<any> {
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller + "/entity");
  }

  getColumnName(className:string): Observable<any> {
    const params = new HttpParams()
    .set('className', className)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller + "/column", {params});
  }
  getCrawlerAttrMap(id:any): Observable<any>{
    const params = new HttpParams()
    .set('id', id)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller + "/att-map", {params});
  }

  deleteConfiguration(lookupConfigId:any): Observable<any>{
    const params = new HttpParams()
    .set('lookupConfigId', lookupConfigId)
    return this.http.delete<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller, {params});
  }

}
