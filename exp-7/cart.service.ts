import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Event } from '../models/event.model';

export interface CartItem extends Event {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private readonly CART_STORAGE_KEY = 'cart_items';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadCartFromStorage();
  }
  private loadCartFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedCart = localStorage.getItem(this.CART_STORAGE_KEY);
      if (storedCart) {
        this.cartItems.next(JSON.parse(storedCart));
      }
    }
  }

  private saveCartToStorage(items: CartItem[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
    }
  }

  // GET method to fetch cart items
  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  // GET method to fetch a specific cart item
  getCartItemById(id: number): Observable<CartItem | undefined> {
    return new Observable(observer => {
      const items = this.cartItems.value;
      const item = items.find(item => item.id === id);
      observer.next(item);
      observer.complete();
    });
  }
  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => 
      total + (item.price * item.quantity), 0);
  }

  // GET method to get cart count
  getCartCount(): number {
    return this.cartItems.value.reduce((count, item) => 
      count + item.quantity, 0);
  }

  addToCart(event: Event, quantity: number = 1): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.id === event.id);

    if (existingItem) {
      const updatedItems = currentItems.map(item =>
        item.id === event.id ? { ...item, quantity: item.quantity + quantity } : item
      );
      this.cartItems.next(updatedItems);
      this.saveCartToStorage(updatedItems);
    } else {
      const newItems = [...currentItems, { ...event, quantity: quantity }];
      this.cartItems.next(newItems);
      this.saveCartToStorage(newItems);
    }
  }

  removeFromCart(eventId: number): void {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(item => item.id !== eventId);
    this.cartItems.next(updatedItems);
    this.saveCartToStorage(updatedItems);
  }

  clearCart(): void {
    this.cartItems.next([]);
    this.saveCartToStorage([]);
  }
}



  // GET method to get cart total



