import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatabaseHelper } from 'src/app/models/DatabaseHelper';
import { Route } from 'src/app/models/Route';
import { UserAccountRequest } from 'src/app/models/UserAccountRequest';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-account-user',
  templateUrl: './account-user.component.html',
  styleUrls: ['./account-user.component.css']
})
export class AccountUserComponent implements OnInit {

  constructor(private dataService:DataService,
    private authService : AuthService) { }

  readonly Route = Route;
  ngOnInit(): void {
    this.getAllUser();
  }

  @ViewChild('createUsermodalButton') createUsermodalButton! :ElementRef;
  userForm(){
    this.userAccountRequest  = new UserAccountRequest();
    this.createUsermodalButton.nativeElement.click();
  }

  userAccountRequest :UserAccountRequest = new UserAccountRequest();
  creatingUser:boolean=false;
  @ViewChild('closeLeaderModel') closeLeaderModel !: ElementRef;
  createUser(){
    this.creatingUser = true;
    this.authService.createUser(this.userAccountRequest).subscribe(response=>{
      this.creatingUser = false;
      this.getAllUser();
      this.closeLeaderModel.nativeElement.click();
    },error=>{
      this.creatingUser = false;
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
