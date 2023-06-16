import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ConfigurationListingComponent } from './configuration-listing/configuration-listing.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CircularLoaderComponent } from './circular-loader/circular-loader.component';
import { FormsModule } from '@angular/forms';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { SafePipe } from './pipe/safe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ConfigurationComponent,
    ConfigurationListingComponent,
    CircularLoaderComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    AngularMultiSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
