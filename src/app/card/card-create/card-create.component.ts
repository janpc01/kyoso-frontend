import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { CardService } from '../../services/card.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-create.component.html',
  styleUrls: ['./card-create.component.css'],
})
export class CardCreateComponent {
  card: any = {
    name: '',
    beltRank: '',
    achievement: '',
    clubName: '',
    image: ''
  };

  selectedImage: File | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private authService: AuthService, private cardService: CardService, private router: Router) {}

  onImageSelected(event: any) {
    this.card.image = event.target.files[0];
  }

  async createCard(): Promise<void> {
    if (!this.card.name || !this.card.beltRank || !this.card.achievement || !this.card.clubName) {
      alert('Please fill in all required fields');
      return;
    }
  
    if (!this.card.image) {
      alert('Please select an image');
      return;
    }
  
    try {
      const isAuthenticated = await this.authService.checkAuthentication();
      if (!isAuthenticated) {
        alert('Please login to create a card');
        return;
      }
      
      // Convert the objectUrl to base64 with reduced quality
      const response = await fetch(this.card.image);
      const blob = await response.blob();
      
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Get the base64 string without the data URL prefix
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
        reader.readAsDataURL(blob);
      });
  
      // Send the card with base64 image
      const cardData = {
        ...this.card,
        image: base64Image
      };
  
      await this.cardService.createCard(cardData);
      await this.router.navigate(['/user/cards']);
    } catch (err: any) {
      console.error('Error creating card:', err);
      if (err.status === 401) {
        localStorage.setItem('redirectAfterLogin', '/user/cards/create');
        await this.router.navigate(['/login']);
      } else {
        alert('Error creating card. Please try again with a smaller image.');
      }
    }
  }
}
