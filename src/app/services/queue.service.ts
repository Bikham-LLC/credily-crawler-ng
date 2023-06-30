import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseHelper } from '../models/DatabaseHelper';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Keys } from '../models/key';

@Injectable({
  providedIn: 'root'
})
export class QueueService {

  constructor(private http :HttpClient) { }
  key : Keys = new Keys();

  getQueue(databasehelper:DatabaseHelper):Observable<any>{
    const params = new HttpParams()
    .set('search', databasehelper.search)
    .set('currentPage', databasehelper.currentPage)
    .set('itemsPerPage', databasehelper.itemsPerPage)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.queue, {params});
  }
}
