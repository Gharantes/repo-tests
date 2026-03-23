import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IEventModel } from '@synergia-frontend/interfaces';
import { EventCardGridEntryComponent } from '../event-card-grid-entry/event-card-grid-entry.component';

@Component({
  selector: 'lib-event-card-grid',
  templateUrl: `event-card-grid.component.html`,
  styleUrl: 'event-card-grid.component.scss',
  imports: [CommonModule, EventCardGridEntryComponent],
  standalone: true,
})
export class EventCardGridComponent {
  @Input() public data$: IEventModel[] = [];
  @Output() cardInteractionEvent = new EventEmitter<IEventModel>();
}