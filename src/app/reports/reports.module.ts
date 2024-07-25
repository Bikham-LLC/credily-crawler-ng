import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { FailedConfigReportComponent } from './components/failed-config-report/failed-config-report.component';
import { ProviderReportComponent } from './components/provider-report/provider-report.component';
import { TestReportComponent } from './components/test-report/test-report.component';
import { NoconfigFoundReportComponent } from './components/noconfig-found-report/noconfig-found-report.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { OcrReportComponent } from './components/ocr-report/ocr-report.component';
import { FollowUpReportComponent } from './components/follow-up-report/follow-up-report.component';



@NgModule({
    declarations: [
        ReportsComponent,
        FailedConfigReportComponent,
        ProviderReportComponent,
        TestReportComponent,
        NoconfigFoundReportComponent,
        OcrReportComponent,
        FollowUpReportComponent,
       
    ],
    imports: [
        CommonModule,
        ReportsRoutingModule,
        NgbModule,
        FormsModule,
        SharedModule,
        AngularMultiSelectModule,
    ]
    
})
export class ReportsModule { }
