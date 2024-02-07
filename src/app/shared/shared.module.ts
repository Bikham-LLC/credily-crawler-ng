import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipe } from '../pipe/safe.pipe';
import { FormsModule } from '@angular/forms';
import { CircularLoaderComponent } from '../circular-loader/circular-loader.component';
// import { HeaderComponent } from '../header/header.component';



@NgModule({
  declarations: [
    SafePipe,
    CircularLoaderComponent,
    // HeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports :[
    SafePipe,
    CircularLoaderComponent,
    // HeaderComponent
  ]
})
export class SharedModule { }
