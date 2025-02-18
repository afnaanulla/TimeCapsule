
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-capsule',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './edit-capsule.component.html',
  styleUrls: ['./edit-capsule.component.css'],
})
export class EditCapsuleComponent implements OnInit {
  editCapsuleForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditCapsuleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}


  ngOnInit(): void {
    this.editCapsuleForm = this.fb.group({
      title: [this.data.title, Validators.required],
      content: [this.data.content, Validators.required],
      unlockDate: [this.data.unlockDate, Validators.required]
    });
  }


  // to update capsule data

  updateCapsule(): void {
    const token = localStorage.getItem('jwtToken');
    if (this.editCapsuleForm.valid) {
      this.http.put(`https://timecapsule-l8mr.onrender.com/api/capsules/${this.data._id}`, this.editCapsuleForm.value, {
        headers: { Authorization: `Bearer ${token}` }, // Attach JWT token
        withCredentials: true
      })
        .subscribe(
          () => {
            alert('Capsule updated successfully!');
            this.dialogRef.close(true);
          },
          error => {
            alert('Failed to update capsule: ' + error.error.message);
          }
        );
    }
  }


  // function to close dialogBox

  closeDialog(): void {
    this.dialogRef.close();
  }
}

