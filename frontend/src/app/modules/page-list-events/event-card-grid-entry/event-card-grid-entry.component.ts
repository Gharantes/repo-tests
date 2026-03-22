import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IEventModel } from '@synergia-frontend/interfaces';
import { SafeImageComponent } from '@synergia-frontend/components';

@Component({
  selector: 'app-event-card-grid-entry',
  templateUrl: `event-card-grid-entry.component.html`,
  styleUrl: 'event-card-grid-entry.component.scss',
  imports: [CommonModule, SafeImageComponent],
  standalone: true,
})
export class EventCardGridEntryComponent {
  @Input() public entry!: IEventModel;
  @Output() public cardInteractionEvent = new EventEmitter<IEventModel>();
}