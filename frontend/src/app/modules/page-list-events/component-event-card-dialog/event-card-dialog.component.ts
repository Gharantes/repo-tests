import { Component, inject, signal } from '@angular/core';
import {
  PageExtendedEventResourceService,
  PageListEventsResourceService,
} from '@synergia-frontend/api';
import { IEventModel } from '@synergia-frontend/interfaces';
import { RoutingService } from '@synergia-frontend/services';
import { map, tap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventDtoToModel } from '@synergia-frontend/mappers';

@Component({
  selector: 'app-evento-card-dialog',
  standalone: true,
  templateUrl: './event-card-dialog.component.html',
  styleUrl: 'event-card-dialog.component.scss',
  imports: [],
})
export class EventCardDialogComponent {
  public readonly eventModel$: IEventModel = inject(MAT_DIALOG_DATA);
  public readonly event$ = signal<IEventModel | null>(null);

  constructor(
    private readonly dialog: MatDialogRef<EventCardDialogComponent>,
    private readonly pageService: PageListEventsResourceService,
    private readonly pageService2: PageExtendedEventResourceService,
    private readonly routingService: RoutingService
  ) {
    const idEvent = this.eventModel$.id;
    this.pageService2
      .getDetailedEventById(idEvent)
      .pipe(
        map((res) => EventDtoToModel(res)),
        tap((res) => this.event$.set(res))
      )
      .subscribe();
  }

  public editar() {
    this.routingService.goToEditEvent(this.eventModel$.id);
    this.dialog.close(null);
  }

  protected readonly event = event;
}