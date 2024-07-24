import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RpaRoutingModule } from './rpa-routing.module';
import { RpaComponentComponent } from './component/rpa-component/rpa-component.component';
import { SharedModule } from '../shared/shared.module';
import { RpaComponent } from './rpa.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RpaComponent,
    RpaComponentComponent
  ],
  imports: [
    CommonModule,
    RpaRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class RpaModule { }
