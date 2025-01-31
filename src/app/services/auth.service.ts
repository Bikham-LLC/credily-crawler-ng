import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Keys } from '../models/key';
import { UserAccountRequest } from '../models/UserAccountRequest';
import { Constant } from '../models/Constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  key: Keys = new Keys();

  login(userName: any, password: any): Observable<any> {
    const params = new HttpParams()
    .set('username', userName)
    .set('password', password)

    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.login, {params});
  }

  renewToken(): Observable<any> {
    const params = new HttpParams()
      .set('refreshToken', localStorage.getItem(Constant.REFRESH_TOKEN)!)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.login, {params});
  }

  renewNewToken(refreshToken: any): Observable<any> {
    const params = new HttpParams()
    .set("refreshToken", refreshToken)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + this.key.refresh_token, {params});
  }

  getForgetPasswordOTP(userName:any): Observable<any> {
    const params = new HttpParams()
    .set('userName', userName)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + "/auth/password-otp", {params})
  }

  verifyForgetPasswordOTP(userName:any, otp:any): Observable<any> {
    const params = new HttpParams()
    .set('userName', userName)
    .set('otp', otp)
    return this.http.get<any>(this.key.server_url + this.key.api_version_one + "/auth/verify-password-otp", {params});
  }

  updateUserPassword(userName:any, oldPassword:any, newPassword:any): Observable<any>{
    const params = new HttpParams()
    .set('userName', userName)
    .set('oldPassword', oldPassword)
    .set('newPassword', newPassword)
    return this.http.patch<any>(this.key.server_url + this.key.api_version_one + "/auth/update-password", {}, {params});
  }

  createUser(userAccountRequest:any): Observable<any>{
    return this.http.post<any>(this.key.server_url + this.key.api_version_one + "/auth/create", userAccountRequest);
  }

  getAllUser(search:any, currentPage:any, itemsPerPage:any): Observable<any>{
    const params = new HttpParams()
    .set('tag', search)
    .set('currentPage', currentPage)
    .set('itemsPerPage', itemsPerPage)

    return this.http.get<any>(this.key.server_url + this.key.api_version_one + "/auth/get-user" , {params})
  }

  updateUserStatus(userName:string): Observable<any> {
    const params = new HttpParams()
    .set('userName', userName)

    return this.http.patch<any>(this.key.server_url+this.key.api_version_one + "/auth/update-user-status",{},{params});
  }
}
