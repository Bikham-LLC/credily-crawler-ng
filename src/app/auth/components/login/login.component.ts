import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

declare var Toastnotify: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  togglePassword:string = "password";
  userName: string = '';
  password: string = '';
  loginToggle: boolean = false;

  constructor(private authservice: AuthService) { }

  ngOnInit(): void {
  }

  togglePasswordField(){
    if(this.togglePassword == "password"){
      this.togglePassword = "text"
    }else{
      this.togglePassword = "password";
    }
  }

  login() {
    debugger
    this.loginToggle = true;
    this.authservice.login(this.userName, this.password).subscribe(response=>{

      
      this.loginToggle = false;
    },error=>{
      this.showToast(error.error, 'warning');
      this.loginToggle = false;
    })
  }

  showToast(msg: any, type = 'dark') {
    Toastnotify.create({
      text: msg,
      type: type,
      duration: 5000,
    });
  }

}
