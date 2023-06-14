import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  logOut() {
    localStorage.clear();
    this._router.navigate(['/auth/login']);
  }

}
