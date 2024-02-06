import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { FailedConfigReportComponent } from './components/failed-config-report/failed-config-report.component';
import { ProviderReportComponent } from './components/provider-report/provider-report.component';
import { TestReportComponent } from './components/test-report/test-report.component';
import { NoconfigFoundReportComponent } from './components/noconfig-found-report/noconfig-found-report.component';




@NgModule({
    declarations: [
        ReportsComponent,
        FailedConfigReportComponent,
        ProviderReportComponent,
        TestReportComponent,
        NoconfigFoundReportComponent
        // HeaderComponent
    ],
    exports: [
    // HeaderComponent,
    ],
    imports: [
        CommonModule,
        ReportsRoutingModule
    ]
})
export class ReportsModule { }
