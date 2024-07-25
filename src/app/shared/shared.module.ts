import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from '../pipe/safe.pipe';
import { FormsModule } from '@angular/forms';
import { CircularLoaderComponent } from '../common-component/circular-loader/circular-loader.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { HeaderComponent } from '../common-component/header/header.component';
import { StateDropdownComponent } from '../common-component/state-dropdown/state-dropdown.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FileDragNDropDirective } from '../services/FileDragNDropDirective';



@NgModule({
  declarations: [
    SafePipe,
    CircularLoaderComponent,
    HeaderComponent,
    StateDropdownComponent,
    FileDragNDropDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxDaterangepickerMd.forRoot(),
    AngularMultiSelectModule,
    RouterModule,
    DragDropModule
  ],
  exports :[
    SafePipe,
    CircularLoaderComponent,
    NgxDaterangepickerMd,
    HeaderComponent,
    StateDropdownComponent,
    AngularMultiSelectModule,
    RouterModule,
    DragDropModule,
    FileDragNDropDirective
  ]
})
export class SharedModule { }
