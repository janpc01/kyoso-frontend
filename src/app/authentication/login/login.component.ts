import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = ''; // To store error messages

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/']); // Redirect to home page on successful login
    } catch (error: any) {
      console.error('Login failed:', error);
      this.errorMessage = error?.error?.message || 'An error occurred. Please try again.'; // Extract message or set a default
    }
  }
}
