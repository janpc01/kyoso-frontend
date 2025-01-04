import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardFormatComponent } from '../card-format/card-format.component';
import { CardService } from '../../services/card.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, CardFormatComponent],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css'],
})
export class CardListComponent implements OnInit {
  @Input() cards: any[] = [];
  @Input() isSearchResult: boolean = false;
  errorMessage: string = '';
  showModal: boolean = false;
  cardToDeleteIndex: number | null = null;

  constructor(private cardService: CardService, private cartService: CartService) {}

  async ngOnInit() {
    if (!this.isSearchResult) {
      try {
        const userId = await this.cardService.getUserId();
        this.cards = await this.cardService.getUserCards(userId);
      } catch (error: any) {
        if (error.status === 404) {
          this.errorMessage = 'No cards found for this user.';
        } else {
          this.errorMessage = 'Failed to load cards. Please try again later.';
        }
        console.error('Error fetching cards:', error);
      }
    }
  }

  // Use CartService to add the card to the cart
  addToCart(card: any) {
    this.cartService.addToCart({
      cardId: card._id,
      name: card.name,
      image: card.image,
      price: card.price,
      quantity: 1, // Default to 1 when adding a new item
    });
    alert(`${card.name} has been added to your cart!`);
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
