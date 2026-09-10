import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

import { IEventModel } from '@synergia-frontend/interfaces';
import { SafeImageComponent } from '../../safe-image/safe-image.component';

@Component({
  selector: 'lib-event-card-grid-entry',
  templateUrl: `event-card-grid-entry.component.html`,
  styleUrl: 'event-card-grid-entry.component.scss',
  imports: [SafeImageComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class EventCardGridEntryComponent {
  @Input() public entry!: IEventModel;
  @Output() public cardInteractionEvent = new EventEmitter<IEventModel>();
}