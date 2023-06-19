import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Keys } from '../models/key';

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
    return this.http.patch<any>(this.key.server_url + this.key.api_version_one + "/auth/update-password", {},{params});
  }
}
