import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { AccountUserComponent } from './components/account-user/account-user.component';
import { QueueComponent } from './components/queue/queue.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [{ 
  path: '', component: HomeComponent,
  children:[
    { path: 'configuration', component: ConfigurationComponent },
    { path: 'account-user', component: AccountUserComponent },
    { path: 'queue', component: QueueComponent},
    { path: 'dashboard', component: DashboardComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }