import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FailedConfigReportComponent } from './components/failed-config-report/failed-config-report.component';
import { NoconfigFoundReportComponent } from './components/noconfig-found-report/noconfig-found-report.component';
import { ProviderReportComponent } from './components/provider-report/provider-report.component';
import { TestReportComponent } from './components/test-report/test-report.component';
import { ReportsComponent } from './reports.component';
import { OcrReportComponent } from './components/ocr-report/ocr-report.component';
import { FollowUpReportComponent } from './components/follow-up-report/follow-up-report.component';
import { ReFetchReportComponent } from './components/re-fetch-report/re-fetch-report.component';
import { RpaReportComponent } from './components/rpa-report/rpa-report.component';
import { NpdbReportComponent } from './components/npdb-report/npdb-report.component';
import { BulkReRunComponent } from './components/bulk-re-run/bulk-re-run.component';
import { SchedulerComponent } from './components/scheduler/scheduler.component';

const routes: Routes = [{ 
  path: '', component: ReportsComponent,
  children:[
    {path: 'failed-cofing-report', component: FailedConfigReportComponent},
    {path: 'provider-report', component: ProviderReportComponent},
    {path: 'test-report', component: TestReportComponent},
    {path: 'noconfig-found-report', component: NoconfigFoundReportComponent},
    {path: 'ocr-report', component: OcrReportComponent},
    {path: 'follow-up-report', component: FollowUpReportComponent},
    {path: 're-fetch-report', component: ReFetchReportComponent},
    {path: 'rpa-report', component: RpaReportComponent},
    {path: 'npdb-report', component: NpdbReportComponent},
    {path: 'bulk-rerun', component: BulkReRunComponent},
    {path: 'scheduler', component: SchedulerComponent},
  ] 

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
