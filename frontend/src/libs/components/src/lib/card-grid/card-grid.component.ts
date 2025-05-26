import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IDoCardGrid } from '@synergia-frontend/interfaces';

@Component({
  selector: 'lib-card-grid',
  templateUrl: `index.html`,
  styleUrl: 'style.scss',
  imports: [CommonModule],
  standalone: true
})
export class CardGridComponent {
  @Input() public data$: IDoCardGrid[] = [];
}