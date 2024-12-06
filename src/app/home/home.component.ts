import { Component } from '@angular/core';
import { CardCreateComponent } from '../card/card-create/card-create.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardCreateComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
