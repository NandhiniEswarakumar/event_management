import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <h2>Checkout Form</h2>
      
      <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" class="mt-4">
        <!-- Name Field -->
        <div class="mb-3">
          <label for="name" class="form-label">Full Name</label>
          <input 
            type="text" 
            class="form-control" 
            id="name" 
            formControlName="name"
            [ngClass]="{'is-invalid': isFieldInvalid('name')}">
          <div class="invalid-feedback" *ngIf="isFieldInvalid('name')">
            <div *ngIf="checkoutForm.get('name')?.errors?.['required']">Name is required</div>
            <div *ngIf="checkoutForm.get('name')?.errors?.['maxlength']">Name must be less than 40 characters</div>
          </div>
        </div>

        <!-- Email Field -->
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input 
            type="email" 
            class="form-control" 
            id="email" 
            formControlName="email"
            [ngClass]="{'is-invalid': isFieldInvalid('email')}">
          <div class="invalid-feedback" *ngIf="isFieldInvalid('email')">
            <div *ngIf="checkoutForm.get('email')?.errors?.['required']">Email is required</div>
            <div *ngIf="checkoutForm.get('email')?.errors?.['email']">Please enter a valid email</div>
          </div>
        </div>

        <!-- Phone Field -->
        <div class="mb-3">
          <label for="phone" class="form-label">Phone Number</label>
          <input 
            type="tel" 
            class="form-control" 
            id="phone" 
            formControlName="phone"
            [ngClass]="{'is-invalid': isFieldInvalid('phone')}">
          <div class="invalid-feedback" *ngIf="isFieldInvalid('phone')">
            <div *ngIf="checkoutForm.get('phone')?.errors?.['required']">Phone number is required</div>
            <div *ngIf="checkoutForm.get('phone')?.errors?.['pattern']">Please enter a valid phone number</div>
          </div>
        </div>

        <!-- Address Field -->
        <div class="mb-3">
          <label for="address" class="form-label">Address</label>
          <textarea 
            class="form-control" 
            id="address" 
            rows="3" 
            formControlName="address"
            [ngClass]="{'is-invalid': isFieldInvalid('address')}"></textarea>
          <div class="invalid-feedback" *ngIf="isFieldInvalid('address')">
            <div *ngIf="checkoutForm.get('address')?.errors?.['required']">Address is required</div>
            <div *ngIf="checkoutForm.get('address')?.errors?.['minlength']">Address must be at least 10 characters</div>
          </div>
        </div>

        <!-- City Field -->
        <div class="mb-3">
          <label for="city" class="form-label">City</label>
          <input 
            type="text" 
            class="form-control" 
            id="city" 
            formControlName="city"
            [ngClass]="{'is-invalid': isFieldInvalid('city')}">
          <div class="invalid-feedback" *ngIf="isFieldInvalid('city')">
            <div *ngIf="checkoutForm.get('city')?.errors?.['required']">City is required</div>
          </div>
        </div>

        <!-- State Field -->
        <div class="mb-3">
          <label for="state" class="form-label">State</label>
          <input 
            type="text" 
            class="form-control" 
            id="state" 
            formControlName="state"
            [ngClass]="{'is-invalid': isFieldInvalid('state')}">
          <div class="invalid-feedback" *ngIf="isFieldInvalid('state')">
            <div *ngIf="checkoutForm.get('state')?.errors?.['required']">State is required</div>
          </div>
        </div>

        <!-- Zip Code Field -->
        <div class="mb-3">
          <label for="zipCode" class="form-label">Zip Code</label>
          <input 
            type="text" 
            class="form-control" 
            id="zipCode" 
            formControlName="zipCode"
            [ngClass]="{'is-invalid': isFieldInvalid('zipCode')}">
          <div class="invalid-feedback" *ngIf="isFieldInvalid('zipCode')">
            <div *ngIf="checkoutForm.get('zipCode')?.errors?.['required']">Zip code is required</div>
            <div *ngIf="checkoutForm.get('zipCode')?.errors?.['pattern']">Please enter a valid zip code</div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="d-grid gap-2">
          <button 
            type="submit" 
            class="btn btn-primary" 
            [disabled]="checkoutForm.invalid">
            Place Order
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .invalid-feedback {
      display: block;
    }
  `]
})
export class CheckoutFormComponent implements OnInit {
  checkoutForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(40)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]]
    });
  }

  ngOnInit(): void {
    // Check if cart is empty
    this.cartService.getCartItems().subscribe(items => {
      if (items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.checkoutForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      // Here you would typically send the form data to your backend
      console.log('Form submitted:', this.checkoutForm.value);
      
      // Clear the cart and redirect to success page
      this.cartService.clearCart();
      this.router.navigate(['/order-success']);
    }
  }
} 