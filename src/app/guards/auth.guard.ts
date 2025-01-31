import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Constant } from '../models/Constant';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.getToken()) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }

  getToken(){
    if(localStorage.getItem(Constant.TOKEN)!=null){
      return localStorage.getItem(Constant.TOKEN);
    }
    return null;
   }
}
