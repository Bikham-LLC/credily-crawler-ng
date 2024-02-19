import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AccountUserComponent } from './components/account-user/account-user.component';
import { QueueComponent } from './components/queue/queue.component';


@NgModule({
  declarations: [
    HomeComponent,
    ConfigurationComponent,
    DashboardComponent,
    AccountUserComponent,
    QueueComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NgbModule,
    FormsModule,
    SharedModule,
    AngularMultiSelectModule,
    DragDropModule
  ]
})
export class HomeModule { }
