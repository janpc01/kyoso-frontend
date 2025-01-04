import { Component, EventEmitter, Output } from '@angular/core';
import { CardService } from '../../services/card.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardListComponent } from '../../card/card-list/card-list.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule, CardListComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent {
  searchQuery: string = '';
  searchResults: any[] = [];
  isLoading: boolean = false;
  searchPerformed: boolean = false;

  @Output() searchStarted = new EventEmitter<void>();
  @Output() searchEnded = new EventEmitter<void>();

  constructor(
    private cardService: CardService,
    private router: Router
  ) {}

  async onSearch(): Promise<void> {
    this.searchStarted.emit();
    this.isLoading = true;
    this.searchPerformed = true;

    if (this.searchQuery.trim()) {
      await this.searchCards();
    } else {
      this.searchResults = [];
    }
    
    this.isLoading = false;
    this.searchEnded.emit();
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
}
