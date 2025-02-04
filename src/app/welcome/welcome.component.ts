import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu'
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';

import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    MatRadioModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    // DatePipe,
    MatNativeDateModule,
    MatTableModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDialogModule,



  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  providers:[DatePipe],

})
export class WelcomeComponent implements OnInit {
  capsuleForm!: FormGroup;

  capsules: any[] = [];
  displayedColumns: String[] = ['title', 'unlockDate'];
  isMenuOpen = false;
  filteredCapsules: any[] = [];
  currentSection ='dashboard';
  isPasswordDialogVisible = false;
  enteredPassword: string = '';
  selectedCapsule: any = null;
  selectedFiles: FileList | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private dialog: MatDialog) {}

  onSidenavClick(section: string): void{
    this.isMenuOpen = false;
    this.currentSection = section;
  }

  onFileChange(event: any): void {
    this.selectedFiles = event.target.files;
  }
  ngOnInit(): void {
    this.capsuleForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],  // Should this be `content` instead of `message`?
      unlockDate: ['', [Validators.required]],  // Should this be `unlockDate` instead of `releaseDate`?
      type: ['public', [Validators.required]],
    });
    this.getCapsule();
  }

  createCapsule(): void {
    if (this.capsuleForm.valid) {
      const formData: {
        title: string;
        description: string;
        unlockDate: string;
        content: string;
        type: string;
        password?: String,
      } = {
        title: this.capsuleForm.value.title,
        description: this.capsuleForm.value.content,
        unlockDate: this.capsuleForm.value.unlockDate,
        content: this.capsuleForm.value.content,
        type: this.capsuleForm.value.type,
        password: this.capsuleForm.value.type === 'private' ? this.enteredPassword: '',
      };
      this.http.post('http://localhost:2004/api/capsules/create', formData, {
        withCredentials: true,
      }).subscribe(
        (response: any) => {
          alert('Capsule created successfully!');
          this.capsuleForm.reset();
        },
        (error) => {
          alert('Failed to create capsule: ' + error.error.message);
        }
      );
    } else {
      alert('Form is invalid');
    }
  }


  getCapsule(): void {
    this.http.get('http://localhost:2004/api/capsules', {
      withCredentials: true,
    }).subscribe(
      (response: any) => {
        this.capsules = response.map((capsule: any) => ({
          ...capsule,
          unlocked: capsule.type === 'private' ? false : true,
        }));
        this.filteredCapsules = this.capsules;
      },
      (error) => {
        alert('Failed to load capsule' + error.error.message);
      }
    );
  }

  onSearch(event: any): void {
    const query = event.target.value.toLowerCase();  // Get the search query
    this.filteredCapsules = this.capsules.filter(capsule =>
      capsule.title.toLowerCase().includes(query) || capsule.content.toLowerCase().includes(query) // Filter based on title
    );
  }

  viewCapsule(capsule:any): void {
    if(capsule.type == 'private' && capsule.unlocked) {
      this.selectedCapsule = capsule;
      this.isPasswordDialogVisible = true;
    }
    else {
      alert('You can view public capsules directly ');
    }

    alert('Viewing capsule with id: ' + capsule);
  }

  validatePassword(): void {
    if(this.enteredPassword == this.selectedCapsule.password) {
      alert('Password correct viewing private capsule ');
      this.selectedCapsule.unlocked = true;

      this.filteredCapsules = this.filteredCapsules.map((capsule) =>
        capsule === this.selectedCapsule ?{ ...capsule, unlocked: true} :capsule
      );
      this.isPasswordDialogVisible = false;
    }
    else {
      alert('Incorrect password ');
    }
  }

  shareCapsule(capsule: any): void {
    if(capsule.type === 'private' && !capsule.unlocked) {
      alert('private capsule required password validation before sharing ');
    }
    else {
      alert('capsule shared ');
    }
  }

  deleteCapsule(capsuleId: string): void {
    if(confirm('Are you sure you want to delete this capsule ')) {
      this.http.delete(`http://localhost:2004/api/capsules/${capsuleId}`, {
      withCredentials: true,
      }).subscribe(
        (response: any) => {
          alert('Capsule deleted ');
          this.getCapsule();
        },
        (error) => {
          alert('Failed to delete capsule ' + error.error.message);
        }
      );
    }
  }
}
