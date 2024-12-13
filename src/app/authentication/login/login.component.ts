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
  errorMessage: string = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Login failed:', error);
      this.errorMessage = error?.error?.message || 'An error occurred. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
