import { Component, OnInit } from '@angular/core';
import { CardCreateComponent } from '../card/card-create/card-create.component';
import { SearchComponent } from './search/search.component';
import { FaqComponent } from './faq/faq.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardCreateComponent, SearchComponent, FaqComponent, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(
      (status) => (this.isLoggedIn = status)
    );
  }
}