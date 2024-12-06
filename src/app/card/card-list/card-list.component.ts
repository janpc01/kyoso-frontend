import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardFormatComponent } from '../card-format/card-format.component';
import { CardService } from '../../services/card.service';

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

  cart: any[] = [];
  showModal: boolean = false;
  cardToDeleteIndex: number | null = null;

  constructor(private cardService: CardService) {}

  async ngOnInit() {
    try {
      const userId = await this.cardService.getUserId();
      this.cards = await this.cardService.getUserCards(userId);
      console.log(this.cards);
    } catch (error: any) {
      if (error.status === 404) {
        this.errorMessage = 'No cards found for this user.';
      } else {
        this.errorMessage = 'Failed to load cards. Please try again later.';
      }
      console.error('Error fetching cards:', error);
    }
  }

  addToCart(card: any) {
    this.cart.push(card);
    console.log('Added to cart:', card);
  }

  confirmDelete(index: number) {
    this.cardToDeleteIndex = index;
    this.showModal = true;
  }

  async removeCard() {
    if (this.cardToDeleteIndex !== null) {
      try {
        const cardId = this.cards[this.cardToDeleteIndex]._id;
        await this.cardService.deleteCard(cardId);
        this.cards.splice(this.cardToDeleteIndex, 1);
        console.log('Card deleted successfully');
      } catch (error) {
        console.error('Error deleting card:', error);
        this.errorMessage = 'Failed to delete card. Please try again.';
      }
      this.cardToDeleteIndex = null;
    }
    this.showModal = false;
  }

  cancelDelete() {
    this.showModal = false;
    this.cardToDeleteIndex = null;
  }
}
