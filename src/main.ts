import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module'; // Update to match your actual route file location
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),  // Provide routing
    provideHttpClient(),
    provideAnimations(), provideAnimationsAsync()    // Provide HttpClientModule
  ]
}).catch(err => console.error(err));
