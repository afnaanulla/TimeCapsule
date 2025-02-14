import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
// import { NgxBeautifyCursorModule } from 'ngx-beautify-cursor';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  template:`<router-outlet></router-outlet>`
})
export class AppComponent {

  title = 'TimeCapsule';

  constructor(private router: Router) {}

}
