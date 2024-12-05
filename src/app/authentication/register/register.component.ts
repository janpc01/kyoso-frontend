import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}
  
  async onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    try {
      // Register the user
      await this.authService.register({ email: this.email, password: this.password });
      console.log('User registered successfully');

      // Log the user in immediately
      await this.authService.login(this.email, this.password);
      console.log('User logged in successfully');

      // Redirect to home page
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = error?.error?.message || 'An error occurred. Please try again.';
    }
  }
}
