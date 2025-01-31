import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Constant } from '../models/Constant';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.getToken();

    if (token) {
      req = this.addToken(req, token);
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    debugger
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
    var tokenReq =localStorage.getItem("refreshToken");
        return this.authService.renewNewToken(tokenReq).pipe(
          switchMap((response: any) => {
            this.isRefreshing = false;

            console.log('res: ',response)

            localStorage.setItem(Constant.REFRESH_TOKEN ,response.object.refresh_token);
            localStorage.setItem(Constant.TOKEN, response.object.access_token);
            this.refreshTokenSubject.next(response.object.access_token);
            
            return next.handle(this.addToken(request, response.object.access_token));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            localStorage.clear();
            return throwError(err);
          })
        );
    }
    console.log("refresh for return method")
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addToken(request, token || '')))
    );
  }

  getToken(){
    if(localStorage.getItem(Constant.TOKEN)!=null){
      return localStorage.getItem(Constant.TOKEN);
    }
    return null;
   }
}
