import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { ConfigurationComponent } from './configuration/configuration.component';

const routes: Routes = [
  { path: '' , component: LoginComponent, pathMatch:'full'},
  { path: 'configuration', component:ConfigurationComponent}, 
{  path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
