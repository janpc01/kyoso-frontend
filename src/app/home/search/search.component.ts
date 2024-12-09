import { Component, EventEmitter, Output } from '@angular/core';
import { CardService } from '../../services/card.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  searchQuery: string = '';
  searchResults: any[] = [];
  searchTimeout: any;

  @Output() searchStarted = new EventEmitter<void>();
  @Output() searchEnded = new EventEmitter<void>();

  constructor(
    private cardService: CardService,
    private cartService: CartService,
    private router: Router
  ) {}

  onSearch(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchStarted.emit(); // Indicate search is loading
    this.searchTimeout = setTimeout(async () => {
      if (this.searchQuery.trim()) {
        await this.searchCards();
      } else {
        this.searchResults = [];
      }
      this.searchEnded.emit(); // Indicate search is complete
    }, 300);
  }

  private async searchCards(): Promise<void> {
    try {
      const rawResults = await firstValueFrom(this.cardService.searchCards(this.searchQuery.trim()));
      this.searchResults = rawResults.map((card: any) => ({
        ...card,
        image: card.image.startsWith('data:image') 
          ? card.image 
          : `data:image/jpeg;base64,${card.image}`,
      }));
    } catch (err) {
      console.error('Error searching cards:', err);
      this.searchResults = [];
    }
  }

  addToCart(card: any): void {
    this.cartService.addToCart(card);
    this.router.navigate(['/cart']);
  }
}
