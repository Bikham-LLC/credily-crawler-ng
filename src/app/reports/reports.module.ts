import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { FailedConfigReportComponent } from './components/failed-config-report/failed-config-report.component';




@NgModule({
    declarations: [
        ReportsComponent,
        FailedConfigReportComponent
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
