import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { UserAccountRequest } from '../models/UserAccountRequest';

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

    },error=>{
      this.dataService.showToast("Something went wrong!");
    })
  }

  userAccountList : UserAccountRequest[] = [];
  getAllUser(){
    this.authService.getAllUser().subscribe(response=>{
      this.userAccountList = response;
    },error=>{
      this.dataService.showToast("Something went wrong!");
    })
  }

  changeUserStatus(user: UserAccountRequest){
    if (user.status == 'ACTIVE') {
      user.status = 'INACTIVE';
    } else {
      user.status = 'ACTIVE';
    }
    this.updateUserStatus(user);
  }

  updateUserStatus(user: UserAccountRequest){
    this.authService.updateUserStatus(user).subscribe(response=>{
    },error=>{
      this.dataService.showToast("Something went wrong!");
    })
  }


}
