import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-format',
  standalone: true,
  templateUrl: './card-format.component.html',
  styleUrls: ['./card-format.component.css'],
})
export class CardFormatComponent {
  @Input() backgroundImage: string = '../assets/images/card-bg.png'; // URL for the card background
  @Input() cardImage: string = '../assets/images/placeholder.jpg'; // User-uploaded image or placeholder
  @Input() season: string = '2024/25'; // Hardcoded season
  @Input() name: string = 'Name'; // Placeholder or user-input name
  @Input() beltRank: string = 'Belt Rank'; // Placeholder or user-input belt rank
  @Input() achievement: string = 'Achievement'; // Placeholder or user-input achievement
  @Input() clubName: string = 'Club Name'; // Placeholder or user-input club name
}
