import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Keys } from '../models/key';
import { DatabaseHelper } from '../models/DatabaseHelper';
import { Observable } from 'rxjs';
import { Constant } from '../models/Constant';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }

  key: Keys = new Keys();

  getProviderReport(databaseHelper:DatabaseHelper, status:any, startDate:any, endDate:any): Observable<any> {
    if(databaseHelper==undefined || databaseHelper==null){
      databaseHelper = new DatabaseHelper();
    }
    var params = new HttpParams()
    .set('search', databaseHelper.search)
    .set('searchBy', databaseHelper.searchBy)
    .set('currentPage', databaseHelper.currentPage)
    .set('itemsPerPage', databaseHelper.itemsPerPage)
    .set('status', status)
    if(!Constant.EMPTY_STRINGS.includes(startDate) && !Constant.EMPTY_STRINGS.includes(startDate)){
      params = params.set('startDate', startDate)
      .set('endDate', endDate)
    }
    
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.provider_crawler_controller, {params});
  }

}
