import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Keys } from '../models/key';
import { Observable } from 'rxjs';
import { DatabaseHelper } from '../models/DatabaseHelper';
import { LicenseLookupConfigRequest } from '../models/LicenseLookupConfigRequest';
import { Constant } from '../models/Constant';
import { RpaTestRequest } from '../models/RpaTestRequest';
import { LogConfigRequest } from '../models/LogConfigRequest';

@Injectable({
  providedIn: 'root'
})
export class LicenseLookupService {

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

  getLinkTaxonomyIds(link:string, configId:number): Observable<any> {
    const params = new HttpParams()
    .set('configId', configId)
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+'/taxonomy-ids', link, {params});
  }

  testConfiguration(config:LicenseLookupConfigRequest, providerUuid:string, ticketId:number=0): Observable<any> {
    const params = new HttpParams()
    .set('providerUuid', providerUuid)
    .set('ticketId', ticketId)
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller + '/test-config', config, {params});
  }

  createConfiguration(config:LicenseLookupConfigRequest): Observable<any> {
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller, config);
  }

  updateConfiguration(config:LicenseLookupConfigRequest): Observable<any> {
    return this.http.patch<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller, config);
  }

  replicateLookupConfig(accountUuid:any, configId:number): Observable<any> {
    const params = new HttpParams()
    .set('accountUuid', accountUuid)
    .set('configId', configId)
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller + "/replicate",{}, {params});
  }

  getConfiguration(databaseHelper:DatabaseHelper, configReportStatus:any, type:string): Observable<any> {
    if(databaseHelper==undefined || databaseHelper==null){
      databaseHelper = new DatabaseHelper();
    }
    var params = new HttpParams()
    .set('search', databaseHelper.search)
    .set('searchBy', databaseHelper.searchBy)
    .set('currentPage', databaseHelper.currentPage)
    .set('itemsPerPage', databaseHelper.itemsPerPage)
    .set('configReportStatus', configReportStatus)
    .set('type', type)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+'/lookup', {params});
  }

  getTaxonomyLink(search:any, crawlerType:string): Observable<any> {
    const params = new HttpParams()
    .set('search', search)
    .set('type', crawlerType)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+'/taxonomy-link', {params});
  }
 
  getConfigurationLink(search:any, crawlerType:string): Observable<any> {
    const params = new HttpParams()
    .set('search', search)
    .set('type', crawlerType)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+'/configuration-link', {params});
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

  getUnMappedTaxonomyIds(ids:any, type:string, state:string, databaseHelper:DatabaseHelper): Observable<any>{
   
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
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller + "/unmapped-taxonomy-ids", ids, {params});
  }

  updateConfigStatus(id:any) :Observable<any> {
    const params = new HttpParams()
    .set('id', id)
    return this.http.patch<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller + "/update-config-status", {}, {params});
  }

  updateLookupLink(oldLink:string, newLink:string, configName:string) :Observable<any> {
    var temp: { oldLink: string, newLink: string, configName:string} = { oldLink: oldLink, newLink: newLink , configName: configName};
    return this.http.patch<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller + "/taxonomy-link", temp);
  }

  getLinkLookupName(link:string, type:string): Observable<any> {
    var params = new HttpParams()
    .set('type', type)
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+'/lookup-name', link, {params});
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

  getConfigById(configId:number): Observable<any>{
    var params = new HttpParams()
    .set('configId', configId)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+ '/config', {params});
  }

  getConfigCommentById(configId:number): Observable<any>{
    var params = new HttpParams()
    .set('configId', configId)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+ '/config-comment', {params});
  }

  updateCommentStep(configStepId: number): Observable<any>{
    var params = new HttpParams()
    .set('stepId', configStepId)
    return this.http.put<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+ '/update-comment', {}, {params});
  }

  getAuditTrail(search:string, startDate:any, endDate:any, currentPage:number, itemsPerPage:number): Observable<any>{
    var params = new HttpParams()
    .set('search', search)
    .set('startDate', startDate)
    .set('endDate', endDate)
    .set('currentPage', currentPage)
    .set('itemsPerPage', itemsPerPage)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+ '/audit-trail', {params});
  }

  getConfigAuditTrailLog(configName:string): Observable<any>{
    var params = new HttpParams()
    .set('configName', configName)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+ '/audit-trail-log', {params});
  }

  testRpaConfiguration(rpaTestRequest: RpaTestRequest): Observable<any>{
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+ '/test-rpa-config', rpaTestRequest);
  }

  saveConfigUuid(configId:number, providerUuid:string, stateCode:string): Observable<any>{
    var params = new HttpParams()
    .set('configId', configId)
    .set('providerUuid', providerUuid)
    .set('stateCode', stateCode)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+ '/config-uuid', {params});
  }

  getAllTestQueue() : Observable<any>{
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+ '/all-test-queue');
  }

  matchConfigName(configName:string) : Observable<any>{
    var params = new HttpParams()
    .set('configName', configName)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+ '/match-config-name', {params});
  }

  getCredentialType() : Observable<any>{
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.lookup_config_controller+'/credential-type');
  }

}
