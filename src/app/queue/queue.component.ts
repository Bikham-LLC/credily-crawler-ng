import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Constant } from '../models/Constant';
import { DataService } from '../services/data.service';
import { QueueService } from '../services/queue.service';
import { DatabaseHelper } from '../models/DatabaseHelper';
import { QueueInstance } from '../models/QueueInstance';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit {

  constructor(private dataService : DataService,
    private queueService : QueueService) { }

  ngOnInit(): void {
    this.getAllQueue();
  }

  readonly Constant = Constant;
  databaseHelper : DatabaseHelper = new DatabaseHelper();
  queueInstanceList : QueueInstance[] = new Array();
  totalQueue:number = 0;
  loadingQueue:boolean = false;
  getAllQueue(){
    this.loadingQueue = true;
    this.queueService.getQueue(this.databaseHelper).subscribe(response=>{
      this.queueInstanceList = response.dtoList;
      this.totalQueue = response.totalAccount;
      this.loadingQueue = false;
    },error=>{
      this.loadingQueue = false;
    })
  }

  pageChanged(event:any){
    this.databaseHelper.currentPage = event;
    this.getAllQueue();
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
