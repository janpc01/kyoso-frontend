import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

// Authentication
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { ProfileComponent } from './authentication/profile/profile.component';

// Shopping
import { CartComponent } from './shopping/cart/cart.component';
import { CheckoutComponent } from './shopping/checkout/checkout.component';
import { OrderConfirmationComponent } from './shopping/order-confirmation/order-confirmation.component';

// Extra Pages
import { ContactComponent } from './extra-pages/contact/contact.component';
import { GameRulesComponent } from './extra-pages/game-rules/game-rules.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-confirmation', component: OrderConfirmationComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'game-rules', component: GameRulesComponent },
  { path: '**', redirectTo: '' }, // Redirect unknown routes to home
];
