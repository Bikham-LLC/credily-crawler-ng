import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FailedConfigReportComponent } from './components/failed-config-report/failed-config-report.component';
import { ReportsComponent } from './reports.component';

const routes: Routes = [{ 
  path: '', component: ReportsComponent,
  children:[
    {path: 'failed-cofing-report', component: FailedConfigReportComponent}
  ] 

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
