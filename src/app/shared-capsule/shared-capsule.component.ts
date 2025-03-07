import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-shared-capsule',
  templateUrl: './shared-capsule.component.html',
  styleUrls: ['./shared-capsule.component.css'],
  imports: [CommonModule],
})
export class SharedCapsuleComponent implements OnInit {
  capsuleId: string | null = null;
  capsule: any = null;
  errorMessage: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.capsuleId = this.route.snapshot.paramMap.get('id');
    console.log('Shared Capsule ID:', this.capsuleId);

    if (this.capsuleId) {
      fetch(`https://timecapsule-l8mr.onrender.com/api/capsules/share/${this.capsuleId}`, {
        credentials: 'include'
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Capsule not found');
          }
          return response.json();
        })
        .then(data => {
          console.log('Fetched Capsule:', data);
          this.capsule = data;

            // ensuring images are in correct format or not
    this.capsule = {
      ...data,
      images: data.images?.map((img: any) => (typeof img === 'string' ? { url: img } : img)) || []
    };
        })
        .catch(error => {
          console.error('Error fetching capsule:', error);
          this.errorMessage = 'Capsule not found or expired.';
        });
    }

  }
}
