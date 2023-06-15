import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { ConfigurationListingComponent } from './configuration-listing/configuration-listing.component';
import { ConfigurationComponent } from './configuration/configuration.component';

const routes: Routes = [
  { path: '' , component: LoginComponent, pathMatch:'full'},
  { path: 'configuration', component:ConfigurationComponent}, 
<<<<<<< HEAD
  { path: 'configuration-listing', component:ConfigurationListingComponent}, 
{  path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }];
=======
  {  path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }];
>>>>>>> 1d84089b2c204ea2356e2caa17c0ca6fe4035820

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
