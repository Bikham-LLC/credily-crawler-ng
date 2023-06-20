import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-account-user',
  templateUrl: './account-user.component.html',
  styleUrls: ['./account-user.component.css']
})
export class AccountUserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @ViewChild('createUsermodalButton') createUsermodalButton! :ElementRef;
  userForm(){
    this.createUsermodalButton.nativeElement.click();
  }

}
