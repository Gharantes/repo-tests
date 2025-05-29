import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IDoCardGrid } from '@synergia-frontend/interfaces';
import { CardGridEntryInteractionType } from './card-grid-entry-interaction-type';
import { IDoCardGridEntryInteraction } from './i-do-card-grid-entry-interaction';

@Component({
  selector: 'lib-card-grid-entry',
  templateUrl: `index.html`,
  styleUrl: 'style.scss',
  imports: [CommonModule],
  standalone: true,
})
export class CardGridEntryComponent {
  @Input() public entry!: IDoCardGrid;
  @Output() public cardInteractionEvent = new EventEmitter<IDoCardGridEntryInteraction>();

  hasBanner(): boolean {
    return !(this.entry.urlBanner == null) && !(this.entry.urlBanner === '');
  }
  interact(interactionType: CardGridEntryInteractionType) {
    this.cardInteractionEvent.emit({
      entry: this.entry,
      interactionType: interactionType
    })
  }
  public errorOnLoadingImage = false;
  public errorOnLoad() {
    this.errorOnLoadingImage = true
  }
}