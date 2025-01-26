import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from "./auth/register/register.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],  // Import necessary components here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  template:`<router-outlet></router-outlet>`
})
export class AppComponent {

  title = 'TimeCapsule';

  constructor(private router: Router) {}
}
