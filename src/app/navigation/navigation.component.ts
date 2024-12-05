import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authSubscription!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (authStatus) => {
        this.isAuthenticated = authStatus; // Update when the auth status changes
      }
    );
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe(); // Avoid memory leaks
  }

  logout() {
    this.authService.logout().then(() => {
      this.isAuthenticated = false;
      console.log('User logged out successfully');
    }).catch((error) => {
      console.error('Logout failed:', error);
    });
  }

}
