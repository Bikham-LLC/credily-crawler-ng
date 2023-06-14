import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

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

  constructor(private authservice: AuthService,
    private dataService: DataService,
    private _router: Router) { }

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

      localStorage.setItem('idToken', response.idToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('accountUuid', response.accountUuid);
      localStorage.setItem('userName', response.userName);

      this._router.navigate(['/configuration']);
    
      this.loginToggle = false;
    },error=>{
      this.loginToggle = false;
      this.dataService.showToast(error);
    })
  }

}
