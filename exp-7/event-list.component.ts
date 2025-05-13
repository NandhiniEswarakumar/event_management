// src/app/components/event-list/event-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Event } from '../../models/event.model';
import { EventService } from '../../services/event.service';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class EventListComponent implements OnInit {
  @ViewChild('searchForm') searchForm!: NgForm;
  events: Event[] = [];
  filteredEvents: Event[] = [];
  searchTerm: string = '';
  cartItemCount: number = 0;
  defaultImage = 'assets/images/placeholder.jpg';

  constructor(
    private eventService: EventService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.cartService.getCartItems().subscribe((items: CartItem[]) => {
      this.cartItemCount = items.reduce((total: number, item: CartItem) => 
        total + (item.quantity || 1), 0);
    });
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
      this.filteredEvents = events;
    });
  }

  search(): void {
    if (!this.searchTerm.trim()) {
      this.filteredEvents = this.events;
      return;
    }
    this.filteredEvents = this.events.filter(event =>
      event.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  addToCart(event: Event): void {
    this.cartService.addToCart(event);
  }

  handleImageError(event: any): void {
    event.target.src = this.defaultImage;
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }
}