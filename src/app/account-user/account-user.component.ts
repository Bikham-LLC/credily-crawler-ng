import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { UserAccountRequest } from '../models/UserAccountRequest';
import { DatabaseHelper } from '../models/DatabaseHelper';

@Component({
  selector: 'app-account-user',
  templateUrl: './account-user.component.html',
  styleUrls: ['./account-user.component.css']
})
export class AccountUserComponent implements OnInit {

  constructor(private dataService:DataService,
    private authService : AuthService) { }

  ngOnInit(): void {
    this.getAllUser();
  }

  @ViewChild('createUsermodalButton') createUsermodalButton! :ElementRef;
  userForm(){
    this.createUsermodalButton.nativeElement.click();
  }

  userAccountRequest :UserAccountRequest = new UserAccountRequest();
  createUser(){
    this.authService.createUser(this.userAccountRequest).subscribe(response=>{
      this.getAllUser();
    },error=>{
    })
  }

  totalAccountCount:number=0;
  userAccountList : UserAccountRequest[] = [];
  loadingUser:boolean = false;
  getAllUser(){
    this.loadingUser = true;
    this.authService.getAllUser(this.userDatabaseHelper.search, this.userDatabaseHelper.currentPage,this.userDatabaseHelper.itemsPerPage).subscribe(response=>{
      this.userAccountList = response.dtoList;
      this.totalAccountCount = response.totalAccount;
      this.loadingUser = false;
    },error=>{
      this.loadingUser = false;
    })
  }

  changeUserStatus(user: UserAccountRequest){
    if (user.status == 'Active') {
      user.status = 'Inactive';
    } else {
      user.status = 'Active';
    }
    this.updateUserStatus(user);
  }

  updateUserStatus(user: UserAccountRequest){
    this.authService.updateUserStatus(user).subscribe(response=>{
    },error=>{
    })
  }

  userDatabaseHelper: DatabaseHelper = new DatabaseHelper();
  pageChanged(event:any){
    if(event!=this.userDatabaseHelper.currentPage){
      this.userDatabaseHelper.currentPage = event;
      this.getAllUser();
    }
  }
   
}
