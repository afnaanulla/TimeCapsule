// angular core modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


//angular form modules

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


//angular material modules

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule
  ],
  exports: [],
})
export class AuthModule {}
