import { Component, inject, signal } from '@angular/core';
import {
  EntityGetByIdResourceService,
  PageExtendedEventResourceService,
  PageListEventsResourceService
} from '@synergia-frontend/api';
import { IEventModel } from '@synergia-frontend/interfaces';
import { RoutingService } from '@synergia-frontend/services';
import { map, tap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventDtoToModel } from '@synergia-frontend/mappers';
import { SafeImageComponent } from '@synergia-frontend/components';

@Component({
  selector: 'app-event-card-dialog',
  standalone: true,
  templateUrl: './event-card-dialog.component.html',
  styleUrl: 'event-card-dialog.component.scss',
  imports: [SafeImageComponent],
})
export class EventCardDialogComponent {
  public readonly eventModel$: IEventModel = inject(MAT_DIALOG_DATA);
  public readonly event$ = signal<IEventModel | null>(null);

  constructor(
    private readonly dialog: MatDialogRef<EventCardDialogComponent>,
    private readonly entityService: EntityGetByIdResourceService,
    private readonly routingService: RoutingService
  ) {
    this.event$.set(this.eventModel$)
    const idEvent = this.eventModel$.id;
    this.entityService
      .getEventById(idEvent)
      .pipe(
        map((res) => EventDtoToModel(res)),
        tap((res) => this.event$.set(res))
      )
      .subscribe();
  }

  public editEvent() {
    this.routingService.goToEditEvent(this.eventModel$.id);
    this.dialog.close(null);
  }
}