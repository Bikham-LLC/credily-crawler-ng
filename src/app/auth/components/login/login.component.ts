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
      if(response.status && response.object!=null){
        localStorage.setItem('idToken', response.object.idToken);
        localStorage.setItem('refreshToken', response.object.refreshToken);
        localStorage.setItem('accountUuid', response.object.accountUuid);
        localStorage.setItem('userName', response.object.userName);
  
        this._router.navigate(['/configuration']);
      }else{
        this.dataService.showToast(response.message);
      }
      this.loginToggle = false;
    },error=>{
      console.log(error)
      this.loginToggle = false;
      if(error.status==0){
        this.dataService.showToast('Server is down, please try after sometime.');
      }else{
        this.dataService.showToast(error.error);
      }
    })
  }

}
