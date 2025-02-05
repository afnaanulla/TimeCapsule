import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  currentTimeStamp: string = '';  // Update here to match the property name

  ngOnInit(): void {
    this.currentTimeStamp = (new Date()).toISOString();  // Also update here
  }
}
