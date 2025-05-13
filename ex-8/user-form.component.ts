import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div class="container mt-5">
      <h2>User Details Form</h2>

      <!-- Display User Info Only After Form is Submitted -->
      <div *ngIf="submitted && submittedData" class="card mb-4">
        <div class="card-header">
          
        </div>
        <div class="card-body">
          <p><strong>Name:</strong> {{ submittedData.name }}</p>
          <p><strong>Email:</strong> {{ submittedData.email }}</p>
          <p><strong>Phone:</strong> {{ submittedData.phone }}</p>
          <p><strong>Gender:</strong> {{ submittedData.gender || 'N/A' }}</p>
        </div>
      </div>

      <!-- Button to Fill Form -->
      <button class="btn btn-secondary mb-3" (click)="fillForm()">Fill Form with User Data</button>

      <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
        <!-- Name -->
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input id="name" type="text" class="form-control" formControlName="name">
          <div class="text-danger" *ngIf="userForm.get('name')?.invalid && userForm.get('name')?.touched">
            Name is required and must be less than 40 characters.
          </div>
        </div>

        <!-- Phone -->
        <div class="mb-3">
          <label for="phone" class="form-label">Phone Number</label>
          <input id="phone" type="tel" class="form-control" formControlName="phone">
          <div class="text-danger" *ngIf="userForm.get('phone')?.invalid && userForm.get('phone')?.touched">
            Phone is required and must be 10 digits.
          </div>
        </div>

        <!-- Email -->
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input id="email" type="email" class="form-control" formControlName="email">
          <div class="text-danger" *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched">
            Valid email is required.
          </div>
        </div>

        <!-- Gender -->
        <div class="mb-3">
          <label for="gender" class="form-label">Gender</label>
          <select id="gender" class="form-control" formControlName="gender">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <div class="text-danger" *ngIf="userForm.get('gender')?.invalid && userForm.get('gender')?.touched">
            Gender is required.
          </div>
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input id="password" type="password" class="form-control" formControlName="password">
          <div class="text-danger" *ngIf="userForm.get('password')?.invalid && userForm.get('password')?.touched">
            Password must be at least 6 characters and include uppercase, lowercase, number, and symbol.
          </div>
        </div>

        <!-- Submit -->
        <button class="btn btn-primary" type="submit" [disabled]="userForm.invalid">Submit</button>
      </form>

      <div *ngIf="submitted" class="alert alert-success mt-3">
        Form submitted successfully!
      </div>
    </div>
  `
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  submitted = false;
  userData: any = null;
  submittedData: any = null; // Store submitted data separately

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(40)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      ]]
    });
  }

  ngOnInit() {
    this.fetchUserData();
    
    // Check for query params and populate form if available
    this.route.queryParams.subscribe(params => {
      if (params['name']) {
        // If URL has user details, populate the form and show submitted data
        const formData = {
          name: params['name'] || '',
          email: params['email'] || '',
          phone: params['phone'] || '',
          gender: params['gender'] || '',
        };
        
        this.userForm.patchValue(formData);
        this.submittedData = formData;
        this.submitted = true;
      }
    });
  }

  fetchUserData() {
    this.http.get('https://jsonplaceholder.typicode.com/users/1')
      .subscribe({
        next: (data: any) => {
          this.userData = data;
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        }
      });
  }

  fillForm() {
    if (this.userData) {
      this.userForm.patchValue({
        name: this.userData.name || '',
        email: this.userData.email || '',
        phone: this.userData.phone || '',
        gender: 'other'
      });
      // Don't show user data card just by filling the form
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formValues = this.userForm.value;
      this.submitted = true;
      this.submittedData = formValues; // Store submitted values
      console.log('User Data:', formValues);
      
      // Update URL with form values (without password for security)
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          name: formValues.name,
          email: formValues.email,
          phone: formValues.phone,
          gender: formValues.gender
        },
        queryParamsHandling: 'merge'
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}