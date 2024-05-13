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

  createQueue(queueName:string, maxRequest:number):Observable<any>{
    const params = new HttpParams()
    .set('queueName', queueName)
    .set('maxRequest', maxRequest)
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.queue, {}, {params});
  }

  updateQueue(id:number, queueName:string, maxRequest:number):Observable<any>{
    const params = new HttpParams()
    .set('id', id)
    .set('queueName', queueName)
    .set('maxRequest', maxRequest)
    return this.http.patch<any>(this.key.server_url + this.key.api_version_one + this.key.queue, {}, {params});
  }

  deleteQueue(id:number):Observable<any>{
    const params = new HttpParams()
    .set('id', id)
    return this.http.delete<any>(this.key.server_url + this.key.api_version_one + this.key.queue, {params});
  }

  updateInstanceType(instanceType:string):Observable<any>{
    const params = new HttpParams()
    .set('instanceType', instanceType)
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + this.key.queue + '/instance-type', {}, {params});
  }
}
