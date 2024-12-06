import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
  isAuthenticated: boolean = false;
  private authSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      }
    );

    this.authService.checkAuthentication();
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/']); // Redirect to home page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
