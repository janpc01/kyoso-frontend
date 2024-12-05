import { Component } from '@angular/core';
import { CardListComponent } from '../../card/card-list/card-list.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CardListComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {}
