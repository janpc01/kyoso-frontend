import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

// Authentication
import { LoginComponent } from './authentication/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }, // Redirect unknown routes to home
];
