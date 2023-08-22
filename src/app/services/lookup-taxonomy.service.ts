import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Keys } from '../models/key';
import { Observable } from 'rxjs';
import { DatabaseHelper } from '../models/DatabaseHelper';
import { LicenseLookupConfigRequest } from '../models/LicenseLookupConfigRequest';
import { Constant } from '../models/Constant';

@Injectable({
  providedIn: 'root'
})
export class LookupTaxonomyService {

  constructor(private http: HttpClient) { }

  key: Keys = new Keys();

  getLookupTaxonomy(databaseHelper:DatabaseHelper, state:string, link:string): Observable<any> {
    if(databaseHelper==undefined || databaseHelper==null){
      databaseHelper = new DatabaseHelper();
    }
    const params = new HttpParams()
    .set('link', link)
    .set('state', state)
    .set('search', databaseHelper.search)
    .set('searchBy', databaseHelper.searchBy)
    .set('currentPage', databaseHelper.currentPage)
    .set('itemsPerPage', databaseHelper.itemsPerPage)

    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_taxonomy, {params});
  }

  getLinkTaxonomyIds(link:string): Observable<any> {
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+'/taxonomy-ids', link);
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

  replicateLookupConfig(accountUuid:any, version:string, configId:number): Observable<any> {
    const params = new HttpParams()
    .set('accountUuid', accountUuid)
    .set('version', version)
    .set('configId', configId)
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller + "/replicate",{}, {params});
  }

  getConfiguration(databaseHelper:DatabaseHelper, startDate:any, endDate:any, version:any, configReportStatus:any): Observable<any> {
    if(databaseHelper==undefined || databaseHelper==null){
      databaseHelper = new DatabaseHelper();
    }
    var params = new HttpParams()
    .set('search', databaseHelper.search)
    .set('searchBy', databaseHelper.searchBy)
    .set('currentPage', databaseHelper.currentPage)
    .set('itemsPerPage', databaseHelper.itemsPerPage)
    .set('version', version)
    .set('configReportStatus', configReportStatus)
    if(!Constant.EMPTY_STRINGS.includes(startDate) && !Constant.EMPTY_STRINGS.includes(startDate)){
      params = params.set('startDate', startDate)
      .set('endDate', endDate)
    }
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+'/lookup', {params});
  }

  getTaxonomyLink(search:any): Observable<any> {
    const params = new HttpParams()
    .set('search', search)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+'/taxonomy-link', {params});
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

  getMappedTaxonomy(ids:any, type:string, state:string, databaseHelper:DatabaseHelper): Observable<any>{
   
    if(databaseHelper==undefined || databaseHelper==null){
      databaseHelper = new DatabaseHelper();
    }
    const params = new HttpParams()
    .set('type', type)
    .set('state', state)
    .set('search', databaseHelper.search)
    .set('searchBy', databaseHelper.searchBy)
    .set('currentPage', databaseHelper.currentPage)
    .set('itemsPerPage', databaseHelper.itemsPerPage)
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller + "/mapped-taxonomy", ids, {params});
  }

  updateConfigStatus(id:any) :Observable<any> {
    const params = new HttpParams()
    .set('id', id)
    return this.http.patch<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller + "/update-config-status", {}, {params});
  }

  idToTestConfig(ids:any) :Observable<any> { 
    const params = new HttpParams()
    .set('ids', ids)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller + "/test", {params});
  }

  updateLookupLink(oldLink:any, newLink:any) :Observable<any> {
    var temp: { oldLink: any, newLink: any } = { oldLink: oldLink, newLink: newLink };
    return this.http.patch<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller + "/taxonomy-link", temp);
  }

  getLinkLookupName(link:string): Observable<any> {
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+'/lookup-name', link);
  }

  getTaxIdsWithLookupName(lookupName:any, link:string): Observable<any> {
    var params = new HttpParams()
    .set('lookupLink', link)
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+'/lookup-name-tax-ids', lookupName, {params});
  }

  getAttachmentType(): Observable<any>{
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+ '/attachment-type');
  }

  getAttachmentSubType(attachmentId:number): Observable<any>{
    var params = new HttpParams()
    .set('attachmentId', attachmentId)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+ '/attachment-sub-type', {params});
  }
}
