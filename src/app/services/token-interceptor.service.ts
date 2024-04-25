import { Injectable, Injector, Type } from '@angular/core';
import { Constant } from '../models/Constant';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import {catchError, filter,switchMap, take} from 'rxjs/operators'
import { Keys } from '../models/key';
import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  readonly Constant = Constant;
  // readonly Route = Route;

  key:Keys = new Keys;
  constructor(private readonly _injector: Injector,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // debugger

    this.authService = this._injector.get(AuthService)

    var token=this.getToken();

    if (req.url.includes("/api/v1/auth")) {
      req = req.clone({ 
        setHeaders: {"Content-Type": 'application/json'},
      });
      return next.handle(req);
    }else {

      req = req.clone({ 
        setHeaders: {Authorization: 'Bearer ' + token,"Content-Type": 'application/json'},
        

      });
    }
    return next.handle(req).pipe(catchError((error:any) => {
      if (error instanceof HttpErrorResponse && !req.url.includes('auth') && error.status === 401) {
        return this.handle401Error(req, next);
      }

      return throwError(error);
    }));
  }

  errorHandler(error: any, req: any, next: any) {
    if (error.status === 401) {
      this.authService.renewToken().subscribe((response: any) => {
        if (response != null && response.object[0] != null) {

          localStorage.clear();
          localStorage.setItem(Constant.TOKEN, response.access_token);
          localStorage.setItem(Constant.REFRESH_TOKEN, response.refresh_token);
          return next.handle(req);

        } else {
          this.router.navigate(['/']);
        }
      })
      return throwError(error);
      
    }
    else if (error.status === 400) {
      return error;
    }

  }


  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.authService.renewToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;

          localStorage.setItem("token", response.access_token);
          localStorage.setItem("refresh_token", response.refresh_token);
          this.refreshTokenSubject.next(response.access_token);

          return next.handle(this.addTokenHeader(request, response.access_token));
        }),
        catchError((err) => {
          this.isRefreshing = false;

          // localStorage.clear();
          return throwError(err);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {

    return request.clone({ headers: request.headers.set(Constant.AUTHORIZATION, 'Bearer ' + token) });

  }

  getToken(){
    if(localStorage.getItem(Constant.TOKEN)!=null){
      return localStorage.getItem(Constant.TOKEN);
    }
    return null;
   }


}
