import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


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
import { MatSelectModule } from '@angular/material/select';

import { EditCapsuleComponent } from '../edit-capsule/edit-capsule.component';

import { debounceTime, min } from 'rxjs/operators';

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
    MatSelectModule



  ],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  providers:[DatePipe],

})
export class WelcomeComponent implements OnInit {
  username: String = '';
  capsuleForm!: FormGroup;
  greetings: String = '';
  capsules: any[] = [];
  displayedColumns: String[] = ['title', 'unlockDate'];
  isMenuOpen = false;
  filteredCapsules: any[] = [];
  currentSection ='dashboard';
  isPasswordDialogVisible = false;
  enteredPassword: string = '';
  selectedCapsule: any = null;
  imageUrls: string[] = [];
  imagePreviewurl: string | ArrayBuffer | null = null;
  selectedSharedCapsule: any = null;
  currentTheme: string = 'default';

  constructor(private fb: FormBuilder, private http: HttpClient, private dialog: MatDialog, private router: Router) {}


  closeModel() {
    this.selectedCapsule = null
  }
  onSidenavClick(section: string): void{
    this.isMenuOpen = false;
    this.currentSection = section;

    if(section === 'inventory') {
      this.getCapsule();
    }
    if(section === 'dashboard') {
      this.getCapsule();
    }
  }

  passwordCorrect(capsule: any): boolean {
    if (capsule.type === 'private') {
      return this.enteredPassword === capsule.password;
    }
    return true;
  }

  validatePassword(capsule: any): void {
    if (this.passwordCorrect(capsule)) {
      this.enteredPassword = '';
    } else {
      alert('Incorrect password! Try again.');
    }
  }

  ngOnInit(): void {
    this.capsuleForm = this.fb.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      unlockDate: ['', [Validators.required]],
      type: ['public', [Validators.required]],
      // oneTimeView: [false],
    });

    const myDate = new Date();
    const hrs = myDate.getHours();
    const mins = myDate.getMinutes();

    if(hrs === 0 || (hrs >= 0 && hrs < 5) || (hrs === 5 && mins < 30)) {
      this.greetings = 'Good Evening ';
    }
    else if ((hrs === 5 && mins >= 30) || (hrs > 5 && hrs < 12)) {
      this.greetings = 'Good Morning';
    } else if ((hrs === 12) || (hrs > 12 && hrs < 18) || (hrs === 17 && mins < 60)) {
      this.greetings = 'Good Afternoon';
    } else {
      this.greetings = 'Good Evening';
    }

    this.capsuleForm.get('type')?.valueChanges.subscribe((type) => {
      if (type === 'private') {
        this.capsuleForm.addControl('password', this.fb.control('', Validators.required));
      } else {
        this.capsuleForm.removeControl('password');
      }
    });
    this.currentSection ='home';

  }


  onImageChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const files: File[] = Array.from(event.target.files as FileList); // Ensure it's an array of File objects

      console.log("Selected Files:", files); // Debugging: Check selected files

      const maxImages = 5;

      if (this.imageUrls.length + files.length > maxImages) {
        alert("You can upload a maximum of 5 images.");
        return;
      }
      this.uploadImages(files);
    }
    else {
      console.warn('No files selected');
    }
  }



  uploadImages(files: any[]): void {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    this.http.post('http://localhost:2004/api/capsules/upload', formData).subscribe(
      (response: any) => {
        this.imageUrls = response.imageUrls;
      },
      (error) => {
        console.error('Image uploading failed ', error);
      }
    );
  }

  goToCapsuleForm() {
    this.router.navigate(['/capsule-form']); // Adjust the route as needed
  }


  createCapsule(): void {
    if (this.capsuleForm.valid) {
      const formData: any = {
        title: this.capsuleForm.value.title,
        description: this.capsuleForm.value.content,
        unlockDate: this.capsuleForm.value.unlockDate,
        content: this.capsuleForm.value.content,
        type: this.capsuleForm.value.type,
        password: this.capsuleForm.value.type === 'private' ? this.capsuleForm.value.password : '',
        images: this.imageUrls, // Add the image URLs to the form data
        // oneTimeView: this.capsuleForm.value.oneTimeView,
      };

      this.http.post('http://localhost:2004/api/capsules/create', formData, {
        withCredentials: true,
      }).subscribe(
        (response: any) => {
          alert('Capsule created successfully!');
          this.capsuleForm.reset();
          this.imageUrls = [];
          this.imagePreviewurl = null; // Reset the image URLs after creating the capsule
          this.currentSection = 'dashboard';
          this.getCapsule();
        },
        (error) => {
          alert('Failed to create capsule: ' + error.error.message);
        }
      );
    } else {
      alert('Form is invalid');
    }
  }
    // Upload image and get its URL


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

  viewCapsule(capsule: any): void {
    if (capsule.type === 'private' && !capsule.unlocked) {
      const enteredPassword = prompt('This capsule is private. Enter the password:');
      if (enteredPassword !== capsule.password) {
        alert('Incorrect password! Try again.');
        return;
      }
      capsule.unlocked = true; // Unlock the capsule after correct password
    }


    console.log("Viewing capsule:", capsule); // Debugging log
    console.log("Images:", capsule.images);
    this.selectedCapsule = capsule;
  }

  shareCapsule(capsule: any): void {
    if (capsule.sharableLink) {
      // Use the correct frontend URL
      const frontendLink = `${window.location.origin}/shared/${capsule.sharableLink}`;
      this.copyToClipboard(frontendLink);
      return;
    }

    // Generate the shareable link from the backend
    this.http.post(`http://localhost:2004/api/capsules/share/${capsule._id}`, {}, {
      withCredentials: true
    }).subscribe(
      (response: any) => {
        if (response.sharableLink) {
          capsule.sharableLink = response.sharableLink;
          const frontendLink = `${window.location.origin}/shared/${response.sharableLink}`;
          this.copyToClipboard(frontendLink);
        } else {
          alert('Failed to generate shareable link.');
        }
      },
      (error) => {
        console.error('Error generating shareable link', error);
        alert('Error generating shareable link: ' + error.error.message);
      }
    );
  }

  // Function to Copy Link to Clipboard
  copyToClipboard(link: string): void {
    navigator.clipboard.writeText(link)
      .then(() => {
        alert('Capsule link copied to clipboard!');
      })
      .catch(err => {
        console.error('Error copying link', err);
        alert('Failed to copy link');
      });
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


  editCapsule(capsule: any): void {
    const dialogRef = this.dialog.open(EditCapsuleComponent, {
      width: '900px',
      data: capsule
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCapsule();  // Refresh the list after update
      }
    });
  }


  logout() {
    this.http.post('http://localhost:2004/auth/logout', {}).subscribe(
      (response) => {
        console.log('Logout successful', response);
        // Optionally, handle redirection or UI changes
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Logout failed', error);
      }
    );
  }

}
