import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
  template: `
  <div class="welcome">
    <h1>welcome to Time Capsule</h1>
    <p>You are now logged in</p>
  </div>
  `,
  styles: [`
    .welcome {
      text-align: center;
      margin-top: 50px;
    }
  `]

})
export class WelcomeComponent {

}
