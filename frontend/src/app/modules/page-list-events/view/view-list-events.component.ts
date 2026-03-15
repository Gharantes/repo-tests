import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IEventModel } from '@synergia-frontend/interfaces';
import { HeaderListEventsComponent } from '../component-header-list-events/header-list-events.component';
import { ConnectorListEvents } from '../connector/connector-list-events';

@Component({
  selector: 'app-view-list-events',
  standalone: true,
  templateUrl: './view-list-events.component.html',
  styleUrl: 'view-list-events.component.scss',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    HeaderListEventsComponent,
  ],
})
export class ViewListEventsComponent {
  @Input() data$!: IEventModel[];
  @Input() connector!: ConnectorListEvents;

  @Output() lookupEvent = new EventEmitter<void>();
  @Output() insertEvent = new EventEmitter<void>();
  @Output() editEvent = new EventEmitter<IEventModel>();
  @Output() deleteEvent = new EventEmitter<IEventModel>();
  @Output() openCardEvent = new EventEmitter<IEventModel>();
  @Output() goToDetailsPageEvent = new EventEmitter<IEventModel>();
}
