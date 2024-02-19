import { Component, OnInit } from '@angular/core';
import { Route } from 'src/app/models/Route';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  readonly Route = Route;
  ngOnInit(): void {
  }

}
