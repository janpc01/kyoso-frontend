import { Component, EventEmitter, Output } from '@angular/core';
import { CardService } from '../../services/card.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardFormatComponent } from '../../card/card-format/card-format.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule, CardFormatComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  searchQuery: string = '';
  searchResults: any[] = [];
  searchTimeout: any;
  isLoading: boolean = false;

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

    this.searchStarted.emit();
    this.isLoading = true;
    
    this.searchTimeout = setTimeout(async () => {
      if (this.searchQuery.trim()) {
        await this.searchCards();
      } else {
        this.searchResults = [];
      }
      this.isLoading = false;
      this.searchEnded.emit();
    }, 300);
  }

  private async searchCards(): Promise<void> {
    try {
      const rawResults = await this.cardService.searchCards(this.searchQuery);
      this.searchResults = rawResults.map((card: any) => ({
        ...card,
        image: card.image.startsWith('data:image') 
          ? card.image 
          : `data:image/jpeg;base64,${card.image}`
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
