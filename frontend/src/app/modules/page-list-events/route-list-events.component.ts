import { Component, inject, signal } from '@angular/core';
import { IEventModel } from '@synergia-frontend/interfaces';
import {
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import { concatMap, debounceTime, map, tap } from 'rxjs';
import { EventDtoToModel } from '@synergia-frontend/mappers';
import { MatDialog } from '@angular/material/dialog';
import { ViewListEventsComponent } from './view/view-list-events.component';
import { ConnectorListEvents } from './connector/connector-list-events';
import { DialogCardEventComponent } from '@synergia-frontend/components';
import { EntityEventResourceService } from '@synergia-frontend/api';

@Component({
  selector: 'app-route-list-events',
  standalone: true,
  templateUrl: './route-list-events.component.html',
  styleUrl: `./route-list-events.component.scss`,
  imports: [ViewListEventsComponent],
  providers: [ConnectorListEvents],
})
export class RouteListEventsComponent {
  public readonly data$ = signal<IEventModel[]>([]);
  public readonly connector = inject(ConnectorListEvents);

  constructor(
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService,
    private readonly eventEntityService: EntityEventResourceService,
    private readonly snackService: SnackbarService,
    private readonly dialog: MatDialog
  ) {
    this.watchForm();
    this.listEvents();
  }

  public goToCreateEvent() {
    this.routingService.goToCreateEvent();
  }
  public watchForm() {
    this.connector.form.valueChanges
      .pipe(
        debounceTime(700),
        concatMap(() => this.lookupData$())
      )
      .subscribe();
  }
  public listEvents() {
    this.lookupData$().subscribe();
  }
  public lookupData$() {
    const idTenant = this.sessionService.getTenantId() as number;
    const text = this.connector.form.controls.text.value;
    const tagIds = this.connector.form.controls.tags.value.map((t) => t.id);
    return this.eventEntityService.listEventsByTenant(idTenant, text, tagIds.length ? tagIds : undefined).pipe(
      map((res) => res.map((v) => EventDtoToModel(v))),
      tap((res) => this.data$.set(res))
    );
  }

  public openCard($event: IEventModel) {
    this.dialog
      .open(DialogCardEventComponent, {
        data: $event,
        maxWidth: '100%',
        maxHeight: '100%',
        width: '80%',
        height: '80%',
      })
      .afterClosed()
      .pipe()
      .subscribe();
  }
}