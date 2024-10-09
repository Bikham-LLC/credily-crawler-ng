import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Keys } from '../models/key';
import { DatabaseHelper } from '../models/DatabaseHelper';
import { Observable } from 'rxjs';
import { Constant } from '../models/Constant';
import { CommentRequest } from '../models/CommentRequest';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  key: Keys = new Keys();

  refreshProviderStatus(providerUuid:string):Observable<any> { 
    const params = new HttpParams()
    .set('providerUuid', providerUuid)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.provider_crawler_controller + "/refresh-provider", {params});
  }
  // ------------------------------- config report section -----------------------

  getProviderReport(databaseHelper:DatabaseHelper, filterType:any, startDate:any, endDate:any, version:string, providerType:string): Observable<any> {
    if(databaseHelper==undefined || databaseHelper==null){
      databaseHelper = new DatabaseHelper();
    }
    var params = new HttpParams()
    .set('search', databaseHelper.search)
    .set('searchBy', databaseHelper.searchBy)
    .set('currentPage', databaseHelper.currentPage)
    .set('itemsPerPage', databaseHelper.itemsPerPage)
    .set('filterType', filterType)
    .set('version', version)
    .set('providerType', providerType)
    if(!Constant.EMPTY_STRINGS.includes(startDate) && !Constant.EMPTY_STRINGS.includes(startDate)){
      params = params.set('startDate', startDate)
      .set('endDate', endDate)
    }
    
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/provider-config-report', {params});
  }

  getProviderReportCount(startDate:string, endDate:string, version:string, providerType:string):Observable<any> {
    var params = new HttpParams()
    .set('startDate', startDate)
    .set('endDate', endDate)
    .set('version', version)
    .set('providerType', providerType)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/provider-config-report-count', {params});
  }

  getProviderLogs(providerUuid:string, isRpaConfig:number):Observable<any> {
    var params = new HttpParams()
    .set('providerUuid', providerUuid)
    .set('isRpaConfig', isRpaConfig)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/logs', {params});
  }
  
  reRunProviderLog(logId:number, isRpaConfig:number):Observable<any> {
    var params = new HttpParams()
    .set('logId', logId)
    .set('isRpaConfig', isRpaConfig)
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/re-run-log', {}, {params});
  }


  getTestConfigReport(databaseHelper:DatabaseHelper, startDate:any, endDate:any, configReportStatus:any): Observable<any> {
    if(databaseHelper==undefined || databaseHelper==null){
      databaseHelper = new DatabaseHelper();
    }
    var params = new HttpParams()
    .set('search', databaseHelper.search)
    .set('searchBy', databaseHelper.searchBy)
    .set('currentPage', databaseHelper.currentPage)
    .set('itemsPerPage', databaseHelper.itemsPerPage)
    .set('configReportStatus', configReportStatus)
    if(!Constant.EMPTY_STRINGS.includes(startDate) && !Constant.EMPTY_STRINGS.includes(startDate)){
      params = params.set('startDate', startDate)
      .set('endDate', endDate)
    }
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/test-report', {params});
  }

  getCountTestConfigReport(startDate:string, endDate:string): Observable<any> {
    var params = new HttpParams()
    .set('startDate', startDate)
    .set('endDate', endDate)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/test-report-count', {params});
  }


  // idToTestConfig(ids:any) :Observable<any> { 
  //   const params = new HttpParams()
  //   .set('ids', ids)
  //   return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/test", {params});
  // }

  getScreenshot(id:any) :Observable<any> { 
    const params = new HttpParams()
    .set('configId', id)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/screentshot", {params});
  }

  getConfigId(lookupName: string, lookupLink: string)  :Observable<any> { 
    var params = new HttpParams()
    .set('lookupName', lookupName)
    .set('lookupLink', lookupLink)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/config-id", {params});
  }

  getFailedConfigs(startDate:string, endDate:string, databaseHelper:DatabaseHelper, searchFilter:string, version:string, state:any) :Observable<any> { 
    var params = new HttpParams()
    .set('startDate', startDate)
    .set('endDate', endDate)
    .set('searchFilter', searchFilter)
    .set('version', version)
    .set('search', databaseHelper.search)
    .set('stateList', state)
    .set('currentPage', databaseHelper.currentPage)
    .set('itemsPerPage', databaseHelper.itemsPerPage)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/failed-config-report", {params});
  }

  getFailedConfigsCount(startDate:string, endDate:string, version:string) :Observable<any> { 
    var params = new HttpParams()
    .set('startDate', startDate)
    .set('endDate', endDate)
    .set('version', version)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/failed-config-report-count', {params});
  }

  createConfigComment(commentRequest:CommentRequest) :Observable<any> { 
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/comment', commentRequest);
  }


  getNoConfigFoundReport(startDate:string, endDate:string, databaseHelper:DatabaseHelper, version:string, stateList:any) :Observable<any> { 
    var params = new HttpParams()
    .set('startDate', startDate)
    .set('endDate', endDate)
    .set('version', version)
    .set('stateList', stateList)
    .set('search', databaseHelper.search)
    .set('currentPage', databaseHelper.currentPage)
    .set('itemsPerPage', databaseHelper.itemsPerPage)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/no-config-found-report", {params});
  }


  getOcrProviderAttachment(version:string, startDate:string, endDate:string, databaseHelper:DatabaseHelper) :Observable<any> { 
    var params = new HttpParams()
    .set('version', version)
    .set('startDate', startDate)
    .set('endDate', endDate)
    .set('search', databaseHelper.search)
    .set('currentPage', databaseHelper.currentPage)
    .set('itemsPerPage', databaseHelper.itemsPerPage)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/provider-attachment", {params});
  }

  getAttachmentOcrData(version:string, attachmentId:number) :Observable<any> { 
    var params = new HttpParams()
    .set('version', version)
    .set('attachmentId', attachmentId)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/attachment-ocr", {params});
  }

  getMappedConfiguration(logId:number) :Observable<any> {
    var params = new HttpParams()
    .set('logId', logId)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/mapped-configuration", {params});
  }

  runMappedConfiguration(configId: number, logId:number) :Observable<any> {
    var params = new HttpParams()
    .set('configId', configId)
    .set('logId', logId)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/run-mapped-configuration", {params});
  }

  getReportState(reportType:string) :Observable<any> {
    var params = new HttpParams()
    .set('reportType', reportType)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/report-state", {params});
  }

  updateSnapshot(snapShotRequest:any) :Observable<any> {
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/update-screenshot", snapShotRequest);
  }

  saveRpaResponse(logId:string, status:string, snapshotUrl:string): Observable<any>{
    var tempClass : {logId:string, status: string, url: string} = {logId:logId, status: status, url: snapshotUrl};
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/rpa-response", tempClass);
  }

  reRunRpaConfig(logId:number): Observable<any>{
    var params = new HttpParams()
    .set('logId', logId)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/re-run-rpa-config", {params});
  }

  getReFetchLicenseReport(databaseHelper:DatabaseHelper, startDate:any, endDate:any): Observable<any> {
    if(databaseHelper==undefined || databaseHelper==null){
      databaseHelper = new DatabaseHelper();
    }
    var params = new HttpParams()
    .set('search', databaseHelper.search)
    .set('searchBy', databaseHelper.searchBy)
    .set('currentPage', databaseHelper.currentPage)
    .set('itemsPerPage', databaseHelper.itemsPerPage)
    if(!Constant.EMPTY_STRINGS.includes(startDate) && !Constant.EMPTY_STRINGS.includes(startDate)){
      params = params.set('startDate', startDate)
      .set('endDate', endDate)
    }
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/re-fetch-license-report', {params});
  }
  
  // getReFetchSnapshotReport(providerRequestId:number): Observable<any> {
  //   var params = new HttpParams()
  //   .set('providerRequestId', providerRequestId) 
  //   return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/re-fetch-snapshot-report', {params});
  // }


  getLogCount(providerUuid:string): Observable<any> {
    var params = new HttpParams()
    .set('providerUuid', providerUuid)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/log-count', {params});
  }

  getNoConfigProvider(taxonomyCode:string, taxonomyState:string, currentPage:number, itemsPerPage:number): Observable<any> {
    var params = new HttpParams()
    .set('taxonomyCode', taxonomyCode)
    .set('taxonomyState', taxonomyState)
    .set('currentPage', currentPage)
    .set('itemsPerPage', itemsPerPage)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/no-config-provider', {params});
  }

}
