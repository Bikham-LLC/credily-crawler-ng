import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FailedConfigReportComponent } from './components/failed-config-report/failed-config-report.component';
import { NoconfigFoundReportComponent } from './components/noconfig-found-report/noconfig-found-report.component';
import { ProviderReportComponent } from './components/provider-report/provider-report.component';
import { TestReportComponent } from './components/test-report/test-report.component';
import { ReportsComponent } from './reports.component';

const routes: Routes = [{ 
  path: '', component: ReportsComponent,
  children:[
    {path: 'failed-cofing-report', component: FailedConfigReportComponent},
    {path: 'provider-report', component: ProviderReportComponent},
    {path: 'test-report', component: TestReportComponent},
    {path: 'noconfig-found-report', component: NoconfigFoundReportComponent}
  ] 

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
