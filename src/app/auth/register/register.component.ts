import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule

  ],
  providers: []
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.registerForm.get('username')?.valueChanges.subscribe(() => {
      this.checkUsername();
    });
  }


  checkUsername(): void {
    const usernameControl = this.registerForm.get('username');
    usernameControl?.markAsTouched()
    if(usernameControl?.value === '') {
      this.snackBar.open('Username is required', 'Close', {
        duration:5000,
        panelClass: ['custom-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'left',
      });

    }
  }

  checkEmail(): void {
    const emailControl = this.registerForm.get('email');
    emailControl?.markAsTouched()
    if(emailControl?.value === '') {
      this.snackBar.open('Email is required', 'Close', {
        duration:5000,
        panelClass: ['warn-snackbar'],
        verticalPosition: 'top',
        horizontalPosition: 'left',
      });
    }
  }

  register(): void {
    if (this.registerForm.valid) {
      this.http.post('http://localhost:2004/auth/register', this.registerForm.value).subscribe(
        (response: any) => {
          alert(response.message);
          this.router.navigate(['/login']);
        },
        (error) => {
          alert('Error' + error.error.message);
        }
      );
    }
    else {
      if(!this.registerForm.get('username')?.value) {
        this.snackBar.open('Please enter username ', '', {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      }
    }
  }

  onCancel() {


    this.registerForm.reset();
    this.snackBar.open('You have cancelled the registration', 'Close', {
      duration: 5000,
      panelClass: ['snackbar-cancel'],
      verticalPosition: 'bottom',
      horizontalPosition: 'left',

    });
  }
}
