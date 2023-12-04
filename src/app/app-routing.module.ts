import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { AccountUserComponent } from './account-user/account-user.component';
import { ProviderReportComponent } from './provider-report/provider-report.component';
import { ReportComponent } from './report/report.component';
import { QueueComponent } from './queue/queue.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'configuration', component: ConfigurationComponent },
  { path: 'account-user', component: AccountUserComponent },
  { path: 'report', component: ReportComponent },
  { path: 'provider-report', component: ProviderReportComponent},
  { path: 'queue', component: QueueComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
