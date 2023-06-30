import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild('createQueuemodalButton') createQueuemodalButton!: ElementRef;

  createQueue(){
    this.createQueuemodalButton.nativeElement.click();
  }

  openEditmodel(){
    this.createQueuemodalButton.nativeElement.click();
  }

  @ViewChild('deleteModalButton') deleteModalButton! :ElementRef;
  deleteQueue(){
    this.deleteModalButton.nativeElement.click();
  }
}
