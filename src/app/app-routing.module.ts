import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { ConfigurationListingComponent } from './configuration-listing/configuration-listing.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { AccountUserComponent } from './account-user/account-user.component';

const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'configuration', component: ConfigurationComponent },
  { path: 'configuration-listing', component: ConfigurationListingComponent },
  { path: 'account-user', component: AccountUserComponent },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
