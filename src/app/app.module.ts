import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CircularLoaderComponent } from './circular-loader/circular-loader.component';
import { FormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { SafePipe } from './pipe/safe.pipe';
import { StateDropdownComponent } from './state-dropdown/state-dropdown.component';
import { AccountUserComponent } from './account-user/account-user.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { HeaderComponent } from './header/header.component';
import { ReportComponent } from './report/report.component';
import { ProviderReportComponent } from './provider-report/provider-report.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { QueueComponent } from './queue/queue.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfigurationComponent,
    CircularLoaderComponent,
    SafePipe,
    StateDropdownComponent,
    AccountUserComponent,
    HeaderComponent,
    ReportComponent,
    ProviderReportComponent,
    QueueComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    AngularMultiSelectModule,
    DragDropModule,
    NgxDaterangepickerMd.forRoot()

  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }] ,
  bootstrap: [AppComponent]
})
export class AppModule { }
