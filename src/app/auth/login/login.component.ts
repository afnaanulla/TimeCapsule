import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { matFormFieldAnimations, MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule} from '@angular/material/button';
import { trigger, transition,style,animate } from '@angular/animations';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatCardModule, HttpClientModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: []
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['',[Validators.required]],
      code: ['',[Validators.required]],
    });
  }

  //function to call api to send code

  getCode(): void {
    const username = this.loginForm.get('username')?.value;
    if(!username) {
      alert('Please enter your username to get code ');
      return;
    }

    //post request to send code

    this.http.post('http://localhost:2004/auth/login', { username }).subscribe(
      (response) => {
        alert("Code sent to your mail ");
      },
      (error) => {
        alert(error.error.message || 'Failed to send code ');
      }
    );
  }

  //function to handle login submission

  onLogin(): void {
    if(this.loginForm.valid) {
      this.http.post('http://localhost:2004/auth/verify-code', this.loginForm.value).subscribe(
        (response) => {
          alert('Login successful ');
          this.router.navigate(['/welcome']);
        },
        (error) => {
          alert('Login failed' + error.error.message || 'Invalid username ');
        }
      );
    }
    else {
      alert('Form is invalid ');
    }
  }
}
