import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuration-listing',
  templateUrl: './configuration-listing.component.html',
  styleUrls: ['./configuration-listing.component.css']
})
export class ConfigurationListingComponent implements OnInit {

  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  logOut() {
    localStorage.clear();
    this._router.navigate(['/auth/login']);
  }
}
