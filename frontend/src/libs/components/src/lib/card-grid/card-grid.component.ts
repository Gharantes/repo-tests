import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IDoCardGrid } from '@synergia-frontend/interfaces';
import { CardGridEntryComponent } from '../card-grid-entry/card-grid-entry.component';
import { CardGridEntryInteractionType } from '../card-grid-entry/card-grid-entry-interaction-type';

@Component({
  selector: 'lib-card-grid',
  templateUrl: `index.html`,
  styleUrl: 'style.scss',
  imports: [CommonModule, CardGridEntryComponent],
  standalone: true,
})
export class CardGridComponent {
  @Input() public data$: IDoCardGrid[] = [];

  hasBanner(entry: IDoCardGrid): boolean {
    return !(entry.urlBanner == null) && !(entry.urlBanner === '');
  }

  cardInteraction($event: {
    entry: IDoCardGrid;
    interactionType: CardGridEntryInteractionType
  }) {
    console.log($event);
  }
}