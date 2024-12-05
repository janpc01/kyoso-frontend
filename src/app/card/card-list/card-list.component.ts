import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardFormatComponent } from '../card-format/card-format.component';

@Component({
  selector: 'app-card-list',
  standalone: true,
  imports: [CommonModule, CardFormatComponent],
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css'],
})
export class CardListComponent {
  cards = [
    {
      backgroundImage: '../assets/images/card-bg.png',
      cardImage: '../assets/images/placeholder.jpg',
      name: 'John Doe',
      beltRank: 'Black Belt',
      achievement: 'Regional Champion 2024',
      clubName: 'Victory Judo Club',
    },
    {
      backgroundImage: '../assets/images/card-bg.png',
      cardImage: '../assets/images/placeholder.jpg',
      name: 'Jane Smith',
      beltRank: 'Brown Belt',
      achievement: 'State Finalist 2024',
      clubName: 'Elite Martial Arts',
    },
  ];

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

  ngOnInit() {
    // Here you can fetch the user's cards from a backend service
    // For now, we're using a static example
  }
}
