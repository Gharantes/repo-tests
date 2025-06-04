import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IDoCardGrid } from '@synergia-frontend/interfaces';
import { CardGridEntryInteractionType } from './card-grid-entry-interaction-type';
import { IDoCardGridEntryInteraction } from './i-do-card-grid-entry-interaction';
import { SafeImageComponent } from '../safe-image/safe-image.component';

@Component({
  selector: 'lib-card-grid-entry',
  templateUrl: `index.html`,
  styleUrl: 'style.scss',
  imports: [CommonModule, SafeImageComponent],
  standalone: true,
})
export class CardGridEntryComponent {
  @Input() public entry!: IDoCardGrid;
  @Output() public cardInteractionEvent =
    new EventEmitter<IDoCardGridEntryInteraction>();

  interact(interactionType: CardGridEntryInteractionType) {
    this.cardInteractionEvent.emit({
      entry: this.entry,
      interactionType: interactionType,
    });
  }
}