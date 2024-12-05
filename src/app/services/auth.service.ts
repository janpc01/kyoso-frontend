import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable(); // Observable for components to subscribe to

  constructor(private http: HttpClient) { }

  // Verify authentication by calling the backend /api/auth/verify
  async checkAuthentication(): Promise<boolean> {
    try {
      await lastValueFrom(this.http.get(`${environment.apiUrl}/auth/verify`, { withCredentials: true }));
      this.isAuthenticatedSubject.next(true); // Notify all subscribers
      return true;
    } catch (error) {
      this.isAuthenticatedSubject.next(false); // Notify all subscribers
      return false;
    }
  }

  // Login by calling the backend /api/auth/signin
  async login(email: string, password: string): Promise<void> {
    try {
      await lastValueFrom(
        this.http.post(`${environment.apiUrl}/auth/signin`, { email, password }, { withCredentials: true })
      );
      this.isAuthenticatedSubject.next(true); // Notify all subscribers after successful login
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Logout by calling the backend /api/auth/signout
  async logout(): Promise<void> {
    try {
      await lastValueFrom(this.http.post(`${environment.apiUrl}/auth/signout`, {}, { withCredentials: true }));
      this.isAuthenticatedSubject.next(false); // Notify all subscribers after logout
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  // Register by calling the backend /api/auth/signup
  async register(userData: { email: string; password: string }): Promise<void> {
    try {
      await lastValueFrom(
        this.http.post(`${environment.apiUrl}/auth/signup`, userData)
      );
      console.log('Registration successful');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  // Getter to retrieve current authentication status
  getAuthStatus(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
