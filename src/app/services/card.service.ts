import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CardService {
  constructor(private http: HttpClient) {}

  // Fetch the authenticated user's ID
  async getUserId(): Promise<string> {
    const response: { userId: string } = await lastValueFrom(
      this.http.get<{ userId: string }>(`${environment.apiUrl}/auth/verify`, { withCredentials: true })
    );
    return response.userId;
  }

  // Fetch cards for a specific user and decode base64 images
  async getUserCards(userId: string): Promise<any[]> {
    const response: any[] = await lastValueFrom(
      this.http.get<any[]>(`${environment.apiUrl}/cards/user/${userId}`, { withCredentials: true })
    );

    // Decode base64 images
    const decodedCards = response.map(card => ({
      ...card,
      image: this.decodeBase64(card.image),
      backgroundImage: '../assets/images/card-bg.png',
    }));
    return decodedCards;
  }

  // Decode a base64 string into a usable URL
  private decodeBase64(base64String: string): string {
    const decodedString = `data:image/png;base64,${base64String}`;
    return decodedString;
  }

  // Create a new card
  async createCard(cardData: any): Promise<any> {
    const response = await lastValueFrom(this.http.post(`${environment.apiUrl}/cards`, cardData, { withCredentials: true }));
    return response;
  }

  // Delete a card
  async deleteCard(cardId: string): Promise<any> {
    const response = await lastValueFrom(this.http.delete(`${environment.apiUrl}/cards/${cardId}`, { withCredentials: true }));
    return response;
  }

  // Search for cards
  async searchCards(query: string): Promise<any> {
    return firstValueFrom(
      this.http.get(`${environment.apiUrl}/cards/search?q=${query}`, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      })
    );
  } 
}
