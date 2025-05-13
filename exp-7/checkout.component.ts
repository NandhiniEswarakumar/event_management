import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartTotal: number = 0;
  checkoutComplete: boolean = false;
  
  // Form fields
  customerName: string = '';
  email: string = '';
  address: string = '';
  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartTotal = this.cartService.getCartTotal() * 1.1; // Including tax
  }

  submitOrder(): void {
    // In a real app, you would process payment here
    this.checkoutComplete = true;
    this.cartService.clearCart();
  }
}