import { NgModule } from '@angular/core';
import { SvgEditorComponent } from './svg-editor.component';
import { CommonModule } from '@angular/common';  



@NgModule({
  declarations: [
    SvgEditorComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SvgEditorComponent
  ]
})
export class SvgEditorModule { }
