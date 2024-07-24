import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RpaComponentComponent } from './component/rpa-component/rpa-component.component';
import { RpaComponent } from './rpa.component';

const routes: Routes = [{ 
  path: '', component: RpaComponent,
  children:[
    {path : '', component: RpaComponentComponent}
  ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RpaRoutingModule { }
