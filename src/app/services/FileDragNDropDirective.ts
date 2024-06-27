import { Directive, Output, EventEmitter, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector: '[fileDragDrop]'
  })
  
  export class FileDragNDropDirective {
    @Output() private filesChangeEmiter : EventEmitter<File[]> = new EventEmitter();
    
    @HostBinding('style.background') private background = '#fff';
    @HostBinding('style.border') private borderStyle = '1px dashed';
    @HostBinding('style.border-color') private borderColor = '#d1d5db';
    @HostBinding('style.border-radius') private borderRadius = '5px';
    // @HostBinding('style.content') private descTag = 'drag and drop';
    


    // @HostBinding('style.background') private background = '#eee';
    // @HostBinding('style.border') private borderStyle = '2px dashed';
    // @HostBinding('style.border-color') private borderColor = '#696D7D';
    // @HostBinding('style.border-radius') private borderRadius = '5px';
  
    constructor() { }
  
    @HostListener('dragover', ['$event']) public onDragOver(evt:any){
      evt.preventDefault();
      evt.stopPropagation();
      this.background = '#0070D21A';
      this.borderColor = '#0070D2';
      this.borderStyle = '1px dashed';
      // this.descTag="Drop it here."
    }
  
    @HostListener('dragleave', ['$event']) public onDragLeave(evt:any){
      evt.preventDefault();
      evt.stopPropagation();
      this.background = '#ffffff';
      this.borderColor = '#d1d5db';
      this.borderStyle = '1px dashed';
      // this.descTag="Drag and drop file(s) here."
    }
  
    @HostListener('drop', ['$event']) public onDrop(evt:any){
      evt.preventDefault();
      evt.stopPropagation();
      this.background = '#0070D2';
      this.borderColor = '#696D7D';
      // this.descTag="Drag and drop file(s) here."
      this.borderStyle = '1px dashed';
      let files = evt.dataTransfer.files;
      let valid_files : Array<File> = files;
      this.filesChangeEmiter.emit(valid_files);
    }
  }