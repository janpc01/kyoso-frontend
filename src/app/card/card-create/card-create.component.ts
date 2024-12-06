import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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

  async composeCard(): Promise<void> {
    // Validate required fields
    if (!this.card.name || !this.card.beltRank || !this.card.achievement || !this.card.clubName) {
      alert('Please fill in all required fields');
      return;
    }
  
    if (!this.card.image) {
      alert('Please select an image');
      return;
    }
  
    try {
      // Check if the user is authenticated
      const isAuthenticated = await this.authService.checkAuthentication();
      if (!isAuthenticated) {
        alert('Please login to create a card');
        localStorage.setItem('redirectAfterLogin', '/profile'); // Save redirect path for after login
        await this.router.navigate(['/login']);
        return;
      }
  
      // Convert the image to base64
      const response = await fetch(this.card.image);
      const blob = await response.blob();
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
        reader.readAsDataURL(blob);
      });
  
      // Send the card with the base64 image
      const cardData = {
        ...this.card,
        image: base64Image
      };
  
      await this.cardService.createCard(cardData);
  
      // Redirect to the profile page upon successful creation
      alert('Card created successfully!');
      await this.router.navigate(['/profile']);
    } catch (err: any) {
      console.error('Error creating card:', err);
  
      // Handle unauthenticated users
      if (err.status === 401) {
        localStorage.setItem('redirectAfterLogin', '/profile'); // Save redirect path for after login
        await this.router.navigate(['/login']);
      } else {
        alert('Error creating card. Please try again with a smaller image.');
      }
    }
  }  
}
