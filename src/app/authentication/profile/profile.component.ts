import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CardListComponent } from '../../card/card-list/card-list.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CardListComponent, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  isAuthenticated = false;

  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    this.isAuthenticated = await this.authService.checkAuthentication();
    if (!this.isAuthenticated) {
      // Redirect to home page if not authenticated
      this.router.navigate(['/']);
    }
  }
}