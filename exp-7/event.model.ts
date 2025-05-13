// src/app/models/event.model.ts
export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;  // Keep as string
  location: string;
  price: number;
  imageUrl: string;
  availableTickets: number;
  category: string;
  quantity?: number;
}