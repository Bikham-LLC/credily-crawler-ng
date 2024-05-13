import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constant } from 'src/app/models/Constant';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { QueueInstance } from 'src/app/models/QueueInstance';
import { DataService } from 'src/app/services/data.service';
import { QueueService } from 'src/app/services/queue.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css']
})
export class QueueComponent implements OnInit {

  constructor(private queueService : QueueService,
    private dataService: DataService) {}

  ngOnInit(): void {
    this.getAllQueue();
  }

  readonly Constant = Constant;
  databaseHelper : DatabaseHelper = new DatabaseHelper();
  queueInstanceList : QueueInstance[] = new Array();
  totalQueue:number = 0;
  loadingQueue:boolean = false;
  getAllQueue(){
    debugger
    this.loadingQueue = true;
    this.queueService.getQueue(this.databaseHelper).subscribe(response=>{
      this.queueInstanceList = response.dtoList;
      this.totalQueue = response.totalAccount;
      this.instanceType = response.instanceType;
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
  @ViewChild('closeQueueModel') closeQueueModel!: ElementRef;
  queueinstance: QueueInstance = new QueueInstance();
  creatingQueueSpinner:boolean = false;
  
  openCreateQueueModel(){
    this.queueName = '';
    this.nameToggle = false;
    this.maxRequest = null;
    this.createQueuemodalButton.nativeElement.click();
  }

  queueName:any;
  maxRequest:any;
  nameToggle:boolean = true;
  openEditmodel(queue:QueueInstance){
    debugger
    this.queueId = queue.id;
    this.queueName = queue.queueName;
    this.nameToggle = true;
    this.maxRequest = queue.maxRequest;
    this.createQueuemodalButton.nativeElement.click();
  }

  createQueue(){
    debugger
    this.creatingQueueSpinner = true;
    this.queueService.createQueue(this.queueName, this.maxRequest).subscribe(response=>{
      if(response.status){
        this.getAllQueue();
        this.closeQueueModel.nativeElement.click();
      }
      this.creatingQueueSpinner = false;
    },error=>{
      this.creatingQueueSpinner = false;
    })
    // setTimeout(() => {
    //   this.closeQueueModel.nativeElement.click();
    // }, 500)

    if(this.queueId > 0){
      this.creatingQueueSpinner = true;
      this.queueService.updateQueue(this.queueId, this.queueName, this.maxRequest).subscribe(response=>{
        if(response.status){
          this.getAllQueue();
        }
        this.creatingQueueSpinner = false;
      },error=>{
        this.creatingQueueSpinner = false;
      })
      setTimeout(() => {
        this.closeQueueModel.nativeElement.click();
      }, 500)
     
    }
    
    
  }

  @ViewChild('deleteModalButton') deleteModalButton! :ElementRef;
  queueId:any
  openDeleteModel(id:any){
    this.queueId = id;
    this.deleteModalButton.nativeElement.click();
  }

  deletingToggle:boolean= false;
  deleteQueue(){
    debugger
    this.queueService.deleteQueue(this.queueId).subscribe(response=>{
      this.getAllQueue();
    })
  }

  instanceType:string='';
  updateQueueType(event:any){
    if(event.target.checked){
      this.instanceType = 'Eager'
    } else {
      this.instanceType = 'Idle'
    }
    this.updateInstanceType();
  }

  
  updateInstanceType(){
    this.queueService.updateInstanceType(this.instanceType).subscribe(response=>{
      if(response){
        this.dataService.showToast("Updated Sucessfully", 'success');
      }
    },error=>{

    })
  }

}
