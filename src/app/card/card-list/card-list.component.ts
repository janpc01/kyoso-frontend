import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardFormatComponent } from '../card-format/card-format.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, CardFormatComponent],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css'],
})
export class CardListComponent implements OnInit {
  cards: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    try {
      const userId = await this.getUserId(); // Fetch authenticated user ID
      this.cards = await this.getUserCards(userId);
    } catch (error: any) {
      this.errorMessage = error.message || 'Failed to load cards.';
      console.error('Error fetching cards:', error);
    }
  }

  async getUserId(): Promise<string> {
    const response: any = await lastValueFrom(
      this.http.get(`${environment.apiUrl}/auth/verify`, { withCredentials: true })
    );
    return response.userId;
  }

  async getUserCards(userId: string): Promise<any[]> {
    const response: any = await lastValueFrom(
      this.http.get(`${environment.apiUrl}/cards/${userId}`, { withCredentials: true })
    );
    return response;
  }


  cart: any[] = []; // Stores the cards added to the cart
  showModal: boolean = false; // Tracks if the modal is open
  cardToDeleteIndex: number | null = null; // Tracks the card index to delete

  addToCart(card: any) {
    this.cart.push(card);
    console.log('Added to cart:', card);
  }

  confirmDelete(index: number) {
    this.cardToDeleteIndex = index;
    this.showModal = true; // Show the confirmation modal
  }

  deleteCard() {
    if (this.cardToDeleteIndex !== null) {
      this.cards.splice(this.cardToDeleteIndex, 1);
      console.log('Card deleted at index:', this.cardToDeleteIndex);
      this.cardToDeleteIndex = null;
    }
    this.showModal = false; // Close the modal
  }

  cancelDelete() {
    this.showModal = false; // Close the modal without deleting
    this.cardToDeleteIndex = null;
  }
}
