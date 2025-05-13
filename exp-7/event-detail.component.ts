import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Event } from '../../models/event.model';
import { EventService } from '../../services/event.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event?: Event;
  quantity: number = 1;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadEvent();
  }

  loadEvent(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.eventService.getEventById(id).subscribe(event => {
        if (event) {
          this.event = event;
        } else {
          this.router.navigate(['/events']);
        }
      });
    }
  }

  addToCart(): void {
    if (this.event && this.quantity > 0) {
      this.cartService.addToCart(this.event, this.quantity);
      this.router.navigate(['/cart']);
    }
  }

  incrementQuantity(): void {
    if (this.event && this.quantity < this.event.availableTickets) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}