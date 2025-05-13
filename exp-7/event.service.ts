// src/app/services/event.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events: Event[] = [
    {
      id: 1,
      name: 'Stage Decoration',
      description: 'A three-day music festival featuring top artists from around the world.',
      date: '2025-06-15',
      location: 'Central Park, New York',
      price: 299.99,
      imageUrl: 'assets/images/stage.jpg',
      availableTickets: 1000,
      category: 'Music'
    },
    {
      id: 2,
      name: 'Spotlights and stage lights',
      description: 'Annual technology conference showcasing the latest innovations.',
      date: '2025-07-22',
      location: 'Convention Center, San Francisco',
      price: 499.99,
      imageUrl: 'assets/images/spotlight.jpg',
      availableTickets: 500,
      category: 'Technology'
    },
    {
      id: 3,
      name: 'DJ and Music Setup',
      description: 'Celebrate culinary excellence with top chefs and winemakers.',
      date: '2025-08-10',
      location: 'Downtown District, Chicago',
      price: 199.99,
      imageUrl: 'assets/images/dj.jpg',
      availableTickets: 800,
      category: 'Food & Drink'
    },
    {
      id: 4,
      name: 'Theme Background',
      description: 'Find your perfect match at this exclusive marriage event.',
      date: '2025-09-05',
      location: 'Grand Hotel, Los Angeles',
      price: 149.99,
      imageUrl: 'assets/images/theme.jpg',
      availableTickets: 300,
      category: 'Social'
    },
    {
      id: 5,
      name: 'Floral Arrangements',
      description: 'Contemporary art showcase featuring renowned artists.',
      date: '2025-10-15',
      location: 'Modern Art Museum, Miami',
      price: 79.99,
      imageUrl: 'assets/images/floral.jpg',
      availableTickets: 400,
      category: 'Arts'
    },
    {
      id: 6,
      name: 'Seating Arrangement',
      description: 'Network with industry leaders and learn about future trends.',
      date: '2025-11-20',
      location: 'Business Center, Boston',
      price: 599.99,
      imageUrl: 'assets/images/seat.jpg',
      availableTickets: 200,
      category: 'Business'
    },
    {
      id: 7,
      name: 'Drone coverage',
      description: 'Annual sports championship featuring top athletes.',
      date: '2025-12-10',
      location: 'Sports Arena, Dallas',
      price: 199.99,
      imageUrl: 'assets/images/drone.jpg',
      availableTickets: 5000,
      category: 'Sports'
    },
    {
      id: 8,
      name: 'Entrance Arch',
      description: 'International film festival showcasing independent cinema.',
      date: '2026-01-15',
      location: 'Cinema Complex, Seattle',
      price: 249.99,
      imageUrl: 'assets/images/entrance.jpg',
      availableTickets: 1000,
      category: 'Entertainment'
    },
    {
      id: 9,
      name: '360 video booth',
      description: 'International food expo showcasing independent cinema.',
      date: '2026-01-15',
      location: 'Cinema Complex, Seattle',
      price: 200,
      imageUrl: 'assets/images/video.jpg',
      availableTickets: 1000,
      category: 'Expo'
    }
  ];

  getEvents(): Observable<Event[]> {
    return of(this.events);
  }

  getEventById(id: number): Observable<Event | undefined> {
    const event = this.events.find(event => event.id === id);
    return of(event);
  }
}
