import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule} from '@angular/material/button';
import { trigger, transition,style,animate } from '@angular/animations';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatCardModule, HttpClientModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: []
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {}

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
      this.snackBar.open('Please enter your username to get the code', 'Close', {
        duration: 5000,
        panelClass: ['snackbar-error'],
      });
      return;
    }

    //post request to send code

    this.http.post('https://timecapsule-l8mr.onrender.com/auth/login', { username }, { withCredentials: true}).subscribe(
      (response) => {


        this.snackBar.open('Code sent to your email', 'Close', {
          duration: 5000,
          panelClass: ['snackbar-success'],
        });
      },
      (error) => {
        this.snackBar.open(error.error.message || 'Failed to send code', 'Close', {
          duration: 5000,
          panelClass: ['snackbar-error'],
        });

      }
    );
  }

  //function to handle login submission

  onLogin(): void {
    if(this.loginForm.valid) {
      this.http.post<{ token: string; message: string }>('https://timecapsule-l8mr.onrender.com/auth/verify-code', this.loginForm.value).subscribe(
        (response) => {
          localStorage.setItem('jwtToken', response.token);
          this.snackBar.open('Login successful!', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-success'],
          });
          this.router.navigate(['/welcome']);
        },
        (error) => {
          this.snackBar.open(error.error.message || 'Invalid username or code', 'Close', {
            duration: 5000,
            panelClass: ['snackbar-error'],
          });
        }
      );
    }
    else {
      this.snackBar.open('Form is invalid', 'Close', {
        duration: 5000,
        panelClass: ['snackbar-warning'],
      });
    }
  }
  checkUsername(): void {
    const usernameControl = this.loginForm.get('username');
    usernameControl?.markAsTouched();
    if (usernameControl?.value === '') {
      this.snackBar.open('Username is required', 'Close', {
        duration: 5000,
        panelClass: ['snackbar-error'],
        verticalPosition: 'top',
        horizontalPosition: 'left',
      });
    }
  }
}
