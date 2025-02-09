import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NgxBeautifyCursorModule } from 'ngx-beautify-cursor';

@Component({
  selector: 'app-edit-capsule',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule,
    NgxBeautifyCursorModule
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
      unlockDate: [this.data.unlockDate, Validators.required],
      type: [this.data.type, Validators.required],
      password: [this.data.password || ''],
    });
  }

  updateCapsule(): void {
    if (this.editCapsuleForm.valid) {
      this.http.put(`http://localhost:2004/api/capsules/${this.data._id}`, this.editCapsuleForm.value)
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

  closeDialog(): void {
    this.dialogRef.close();
  }
}

