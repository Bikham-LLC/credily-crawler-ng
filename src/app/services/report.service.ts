import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Keys } from '../models/key';
import { DatabaseHelper } from '../models/DatabaseHelper';
import { Observable } from 'rxjs';
import { Constant } from '../models/Constant';
import { CommentRequest } from '../models/CommentRequest';
import { LogConfigRequest } from '../models/LogConfigRequest';
import { param } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  key: Keys = new Keys();

  refreshProviderStatus(providerUuid: string): Observable<any> {
    const params = new HttpParams()
      .set('providerUuid', providerUuid)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.provider_crawler_controller + "/refresh-provider", { params });
  }
  // ------------------------------- config report section -----------------------

  getProviderReport(databaseHelper: DatabaseHelper, filterType: any, startDate: any, endDate: any, version: string, providerType: string, isLive: number, requestSource: string): Observable<any> {
    if (databaseHelper == undefined || databaseHelper == null) {
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
      .set('isLive', isLive)
      .set('requestSource', requestSource)
    if (!Constant.EMPTY_STRINGS.includes(startDate) && !Constant.EMPTY_STRINGS.includes(startDate)) {
      params = params.set('startDate', startDate)
        .set('endDate', endDate)
    }

    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/provider-config-report', { params });
  }

  getProviderReportCount(startDate: string, endDate: string, version: string, providerType: string, isLive: number, requestSource: string): Observable<any> {
    var params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('version', version)
      .set('providerType', providerType)
      .set('isLive', isLive)
      .set('requestSource', requestSource)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/provider-config-report-count', { params });
  }

  getProviderLogs(providerUuid: string, isRpaConfig: number, providerType: string, isArchive: number, isConfigNotFound: number, isOcrConfig: number, requestSource: string): Observable<any> {
    var params = new HttpParams()
      .set('providerUuid', providerUuid)
      .set('isRpaConfig', isRpaConfig)
      .set('providerType', providerType)
      .set('isArchive', isArchive)
      .set('isConfigNotFound', isConfigNotFound)
      .set('isOcrConfig', isOcrConfig)
      .set('requestSource', requestSource)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/logs', { params });
  }

  reRunProviderLog(logId: number, isRpaConfig: number): Observable<any> {
    var params = new HttpParams()
      .set('logId', logId)
      .set('isRpaConfig', isRpaConfig)
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/re-run-log', {}, { params });
  }

  bulkReRunProviderLog(logIds: any[]): Observable<any> {
    var params = new HttpParams()
    .set('logIds', logIds.join(','));
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/bulk-re-run-log', {}, { params });
  }

  getTestConfigReport(databaseHelper: DatabaseHelper, startDate: any, endDate: any, configReportStatus: any): Observable<any> {
    if (databaseHelper == undefined || databaseHelper == null) {
      databaseHelper = new DatabaseHelper();
    }
    var params = new HttpParams()
      .set('search', databaseHelper.search)
      .set('searchBy', databaseHelper.searchBy)
      .set('currentPage', databaseHelper.currentPage)
      .set('itemsPerPage', databaseHelper.itemsPerPage)
      .set('configReportStatus', configReportStatus)
    if (!Constant.EMPTY_STRINGS.includes(startDate) && !Constant.EMPTY_STRINGS.includes(startDate)) {
      params = params.set('startDate', startDate)
        .set('endDate', endDate)
    }
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/test-report', { params });
  }

  getCountTestConfigReport(startDate: string, endDate: string): Observable<any> {
    var params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/test-report-count', { params });
  }


  // idToTestConfig(ids:any) :Observable<any> { 
  //   const params = new HttpParams()
  //   .set('ids', ids)
  //   return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/test", {params});
  // }

  getScreenshot(id: any): Observable<any> {
    const params = new HttpParams()
      .set('configId', id)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/screentshot", { params });
  }

  getConfigId(lookupName: string, lookupLink: string): Observable<any> {
    var params = new HttpParams()
      .set('lookupName', lookupName)
      .set('lookupLink', lookupLink)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/config-id", { params });
  }

  getFailedConfigs(startDate: string, endDate: string, databaseHelper: DatabaseHelper, searchFilter: string, version: string, state: any, isLive: number): Observable<any> {
    var params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('searchFilter', searchFilter)
      .set('version', version)
      .set('search', databaseHelper.search)
      .set('stateList', state)
      .set('currentPage', databaseHelper.currentPage)
      .set('itemsPerPage', databaseHelper.itemsPerPage)
      .set('isLive', isLive)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/failed-config-report", { params });
  }

  getFailedConfigsCount(startDate: string, endDate: string, version: string): Observable<any> {
    var params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('version', version)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/failed-config-report-count', { params });
  }

  createConfigComment(commentRequest: CommentRequest): Observable<any> {
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/comment', commentRequest);
  }


  getNoConfigFoundReport(startDate: string, endDate: string, databaseHelper: DatabaseHelper, version: string, stateList: any, boardNameList: any, isLive: number): Observable<any> {
    var params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('version', version)
      .set('stateList', stateList)
      .set('boardNameList', boardNameList)
      .set('search', databaseHelper.search)
      .set('currentPage', databaseHelper.currentPage)
      .set('itemsPerPage', databaseHelper.itemsPerPage)
      .set('isLive', isLive)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/no-config-found-report", { params });
  }


  getOcrProviderAttachment(version: string, startDate: string, endDate: string, databaseHelper: DatabaseHelper, isLive: number, uuid: string): Observable<any> {
    var params = new HttpParams()
      .set('version', version)
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('search', databaseHelper.search)
      .set('currentPage', databaseHelper.currentPage)
      .set('itemsPerPage', databaseHelper.itemsPerPage)
      .set('isLive', isLive)
      .set('providerUuid', uuid)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/provider-attachment", { params });
  }

  getAttachmentOcrData(version: string, attachmentId: number, crawlerLogId: number, configName: string): Observable<any> {
    var params = new HttpParams()
      .set('version', version)
      .set('attachmentId', attachmentId)
      .set('crawlerLogId', crawlerLogId)
      .set('configName', configName)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/attachment-ocr", { params });
  }

  getMappedConfiguration(logId: number): Observable<any> {
    var params = new HttpParams()
      .set('logId', logId)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/mapped-configuration", { params });
  }

  runMappedConfiguration(configId: number, logId: number): Observable<any> {
    var params = new HttpParams()
      .set('configId', configId)
      .set('logId', logId)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/run-mapped-configuration", { params });
  }

  getReportState(reportType: string): Observable<any> {
    var params = new HttpParams()
      .set('reportType', reportType)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/report-state", { params });
  }

  uploadSnapshot(snapShotRequest: any): Observable<any> {
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/upload-screenshot", snapShotRequest);
  }

  saveRpaResponse(logId: string, status: string, snapshotUrl: string): Observable<any> {
    var tempClass: { logId: string, status: string, url: string } = { logId: logId, status: status, url: snapshotUrl };
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/rpa-response", tempClass);
  }

  reRunRpaConfig(logId: number): Observable<any> {
    var params = new HttpParams()
      .set('logId', logId)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/re-run-rpa-config", { params });
  }

  getReFetchLicenseReport(databaseHelper: DatabaseHelper, startDate: any, endDate: any, isLive: number): Observable<any> {
    if (databaseHelper == undefined || databaseHelper == null) {
      databaseHelper = new DatabaseHelper();
    }
    var params = new HttpParams()
      .set('search', databaseHelper.search)
      .set('searchBy', databaseHelper.searchBy)
      .set('currentPage', databaseHelper.currentPage)
      .set('itemsPerPage', databaseHelper.itemsPerPage)
      .set('isLive', isLive)
    if (!Constant.EMPTY_STRINGS.includes(startDate) && !Constant.EMPTY_STRINGS.includes(startDate)) {
      params = params.set('startDate', startDate)
        .set('endDate', endDate)
    }
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/re-fetch-license-report', { params });
  }

  // getReFetchSnapshotReport(providerRequestId:number): Observable<any> {
  //   var params = new HttpParams()
  //   .set('providerRequestId', providerRequestId) 
  //   return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/re-fetch-snapshot-report', {params});
  // }


  getLogCount(providerUuid: string, providerType: string, requestSource: string): Observable<any> {
    var params = new HttpParams()
      .set('providerUuid', providerUuid)
      .set('providerType', providerType)
      .set('requestSource', requestSource)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/log-count', { params });
  }

  getNoConfigProvider(taxonomyCode: string, taxonomyState: string, databaseHelper: DatabaseHelper, boardName: string): Observable<any> {
    var params = new HttpParams()
      .set('taxonomyCode', taxonomyCode)
      .set('taxonomyState', taxonomyState)
      .set('currentPage', databaseHelper.currentPage)
      .set('itemsPerPage', databaseHelper.itemsPerPage)
      .set('boardName', boardName)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/no-config-provider', { params });
  }

  mapConfigLog(logIdList: any, configId: number): Observable<any> {
    var params = new HttpParams()
      .set('logIdList', logIdList)
      .set('configId', configId)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/map-log-config', { params });
  }

  getNoConfigTaxonomy(): Observable<any> {
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/no-config-taxonomy');
  }

  getRpaReport(databaseHelper: DatabaseHelper, startDate: any, endDate: any, status: string, isLive: number): Observable<any> {
    if (databaseHelper == undefined || databaseHelper == null) {
      databaseHelper = new DatabaseHelper();
    }
    var params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('search', databaseHelper.search)
      .set('searchBy', databaseHelper.searchBy)
      .set('currentPage', databaseHelper.currentPage)
      .set('itemsPerPage', databaseHelper.itemsPerPage)
      .set('status', status)
      .set('isLive', isLive)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/rpa-report', { params });
  }

  getRpaReportCount(startDate: any, endDate: any): Observable<any> {
    var params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/rpa-report-count', { params });
  }

  getNpdbReport(databaseHelper: DatabaseHelper, startDate: any, endDate: any, isLive: number): Observable<any> {
    if (databaseHelper == undefined || databaseHelper == null) {
      databaseHelper = new DatabaseHelper();
    }
    var params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('search', databaseHelper.search)
      .set('searchBy', databaseHelper.searchBy)
      .set('currentPage', databaseHelper.currentPage)
      .set('itemsPerPage', databaseHelper.itemsPerPage)
      .set('isLive', isLive)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/npdb-report', { params });
  }

  getFollowUpReport(databaseHelper: DatabaseHelper, startDate: any, endDate: any): Observable<any> {
    if (databaseHelper == undefined || databaseHelper == null) {
      databaseHelper = new DatabaseHelper();
    }
    var params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('search', databaseHelper.search)
      .set('searchBy', databaseHelper.searchBy)
      .set('currentPage', databaseHelper.currentPage)
      .set('itemsPerPage', databaseHelper.itemsPerPage)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/follow-up-report', { params });
  }

  mapSnapshotAgain(logId: number): Observable<any> {
    var params = new HttpParams()
      .set('logId', logId)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + "/map-snapshot-again", { params });
  }

  createConfig(logConfigRequest: LogConfigRequest): Observable<any> {
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/config', logConfigRequest);
  }

  deleteLog(logId: number): Observable<any> {
    var params = new HttpParams()
      .set('logId', logId)
    return this.http.delete<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/delete-log', { params });
  }

  getBoardConfigName(startDate: any, endDate: any): Observable<any> {
    var params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/board-name', { params });
  }

  getCredilyProvider(npi: any): Observable<any> {
    var params = new HttpParams()
      .set('npi', npi)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/provider', { params });
  }

  replicateLog(uuid: string, uuidList: any): Observable<any> {
    var params = new HttpParams()
      .set('v3ProviderUuid', uuid)
      .set('uuidList', uuidList)
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/replicate-log', {}, { params });
  }

  configAIReRun(configId: number): Observable<any> {
    var params = new HttpParams()
      .set('configId', configId)
    return this.http.patch<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/ai-re-run', {}, { params });
  }

  markAsComplete(configId: number): Observable<any> {
    var params = new HttpParams()
      .set('configId', configId)
    return this.http.patch<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/mark-complete', {}, { params });
  }

  updateOcrData(attachmentId: number, crawlerLogId: number, ocrConfigName: string, version: string, myMap: any) {
    var params = new HttpParams()
      .set('attachmentId', attachmentId)
      .set('crawlerLogId', crawlerLogId)
      .set('configName', ocrConfigName)
      .set('version', version)
    return this.http.patch<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/ocr-data', myMap, { params });
  }

  getReRunProviderReport(databaseHelper: DatabaseHelper, startDate: any, endDate: any, version: string, licenseList: any, clientList: any, providerList: any, statusList: any, aiStatus: any, isLive: number): Observable<any> {
    if (databaseHelper == undefined || databaseHelper == null) {
      databaseHelper = new DatabaseHelper();
    }
    var params = new HttpParams()
      .set('searchTerm', databaseHelper.search)
      .set('currentPage', databaseHelper.currentPage)
      .set('itemsPerPage', databaseHelper.itemsPerPage)
      .set('isLive', isLive)
    if (!Constant.EMPTY_STRINGS.includes(startDate) && !Constant.EMPTY_STRINGS.includes(startDate)) {
      params = params.set('startDate', startDate)
        .set('endDate', endDate)
    }
    if (version != null) {
      params = params.set('version', version)
    }
    if (clientList != null) {
      params = params.set('clientList', clientList)
    }
    if (licenseList != null) {
      params = params.set('licenseList', licenseList)
    }
    if (providerList != null) {
      params = params.set('providerList', providerList)
    }
    if (statusList != null) {
      params = params.set('statusList', statusList)
    }
    if (aiStatus != null) {
      params = params.set('aiStatus', aiStatus)
    }

    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/rerun-all-report', { params });
  }

  getReRunProviderReportCount(databaseHelper: DatabaseHelper, startDate: any, endDate: any, version: string, licenseList: any, clientList: any, providerList: any,statusList: any, aiStatus: any, isLive: number): Observable<any> {
    if (databaseHelper == undefined || databaseHelper == null) {
      databaseHelper = new DatabaseHelper();
    }
    var params = new HttpParams()
      .set('searchTerm', databaseHelper.search)
      .set('isLive', isLive)
    if (!Constant.EMPTY_STRINGS.includes(startDate) && !Constant.EMPTY_STRINGS.includes(startDate)) {
      params = params.set('startDate', startDate)
        .set('endDate', endDate)
    }
    if (version != null) {
      params = params.set('version', version)
    }
    if (clientList != null) {
      params = params.set('clientList', clientList)
    }
    if (licenseList != null) {
      params = params.set('licenseList', licenseList)
    }
    if (providerList != null) {
      params = params.set('providerList', providerList)
    }
    if (statusList != null) {
      params = params.set('statusList', statusList)
    }
    if (aiStatus != null) {
      params = params.set('aiStatus', aiStatus)
    }
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/rerun-all-report-count', { params });
  }

  getAllReRunProviderId(databaseHelper: DatabaseHelper, startDate: any, endDate: any, version: string, licenseList: any, clientList: any, providerList: any,statusList:any, aiStatus: any, isLive: number): Observable<any> {
    if (databaseHelper == undefined || databaseHelper == null) {
      databaseHelper = new DatabaseHelper();
    }
    var params = new HttpParams()
      .set('searchTerm', databaseHelper.search)
      .set('isLive', isLive)
    if (!Constant.EMPTY_STRINGS.includes(startDate) && !Constant.EMPTY_STRINGS.includes(startDate)) {
      params = params.set('startDate', startDate)
        .set('endDate', endDate)
    }
    if (version != null) {
      params = params.set('version', version)
    }
    if (clientList != null) {
      params = params.set('clientList', clientList)
    }
    if (licenseList != null) {
      params = params.set('licenseList', licenseList)
    }
    if (providerList != null) {
      params = params.set('providerList', providerList)
    }
    if (statusList != null) {
      params = params.set('statusList', statusList)
    }
    if (aiStatus != null) {
      params = params.set('aiStatus', aiStatus)
    }
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/all-rerun-providerid', { params });
  }

  getDistinctClients(searchTerm: any) {
    var params = new HttpParams();
    if (searchTerm != null && searchTerm.trim !== '') {
      params = params.set('searchTerm', searchTerm)
    }
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/get-distinct-clients', { params });
  }

  getDistinctLicenses(searchTerm: any) {
    var params = new HttpParams();
    if (searchTerm != null && searchTerm.trim !== '') {
      params = params.set('searchTerm', searchTerm)
    }
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/get-distinct-licenses', { params });
  }

  getDistinctProviders(searchTerm: any) {
    var params = new HttpParams();
    if (searchTerm != null && searchTerm.trim !== '') {
      params = params.set('searchTerm', searchTerm)
    }
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/get-distinct-providers', { params });
  }

  getDistinctStatus(){
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/get-distinct-status');
  }

  getBulkCrawlerLog(databaseHelper: DatabaseHelper, startDate: any, endDate: any, version: string, status: any, requestSource: any, isLive: number): Observable<any> {
    if (databaseHelper == undefined || databaseHelper == null) {
      databaseHelper = new DatabaseHelper();
    }
    var params = new HttpParams()
      .set('search', databaseHelper.search)
      .set('currentPage', databaseHelper.currentPage)
      .set('itemsPerPage', databaseHelper.itemsPerPage)
      .set('isLive', isLive)
    if (!Constant.EMPTY_STRINGS.includes(startDate) && !Constant.EMPTY_STRINGS.includes(startDate)) {
      params = params.set('startDate', startDate)
        .set('endDate', endDate)
    }
    if (version != null) {
      params = params.set('version', version)
    }
    if (status != null) {
      params = params.set('status', status)
    }
    if (requestSource != null){
      params = params.set('requestSource', requestSource)
    }
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/bulk-crawler-log', { params });
  }


  getBulkCrawlerLogCount(databaseHelper: DatabaseHelper, startDate: any, endDate: any, version: string, status: any, requestSource: any, isLive: number): Observable<any> {
    if (databaseHelper == undefined || databaseHelper == null) {
      databaseHelper = new DatabaseHelper();
    }
    var params = new HttpParams()
      .set('search', databaseHelper.search)
      .set('isLive', isLive)
    if (!Constant.EMPTY_STRINGS.includes(startDate) && !Constant.EMPTY_STRINGS.includes(startDate)) {
      params = params.set('startDate', startDate)
        .set('endDate', endDate)
    }
    if (version != null) {
      params = params.set('version', version)
    }
    if (status != null) {
      params = params.set('status', status)
    }
    if (requestSource != null){
      params = params.set('requestSource', requestSource)
    }
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/bulk-crawler-log-count', { params });
  }

  exportBulkRerun(logIds: number[]): Observable<Blob>{

    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/export-bulk-rerun', logIds, { responseType: 'blob' as 'json'} );

  }



  refetchManualByProvider(providerUuid: string): Observable<any> {
    var params = new HttpParams()
      .set('providerUuid', providerUuid)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.provider_crawler_controller + '/send-crawler-log', { params });
  }

  getNewProviderReportCount(startDate: any, endDate: any, providerType: string, isLive: number): Observable<any> {
    var params = new HttpParams()
      .set('providerType', providerType)
      .set('isLive', isLive)
    if (!Constant.EMPTY_STRINGS.includes(startDate) && !Constant.EMPTY_STRINGS.includes(startDate)) {
      params = params.set('startDate', startDate)
        .set('endDate', endDate)
    }
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.report + '/new-provider-report-count', { params });
  }
}
