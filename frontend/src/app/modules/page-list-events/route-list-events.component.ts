import { Component, inject, signal } from '@angular/core';
import { PageListEventsResourceService } from '@synergia-frontend/api';
import { IEventModel } from '@synergia-frontend/interfaces';
import {
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import { catchError, concatMap, debounceTime, EMPTY, map, tap } from 'rxjs';
import { EventDtoToModel } from '@synergia-frontend/mappers';
import { MatDialog } from '@angular/material/dialog';
import { EventCardDialogComponent } from './component-event-card-dialog/event-card-dialog.component';
import { ViewListEventsComponent } from './view/view-list-events.component';
import { ConnectorListEvents } from './connector/connector-list-events';

@Component({
  selector: 'app-route-list-events',
  standalone: true,
  templateUrl: './route-list-events.component.html',
  styleUrl: `./route-list-events.component.scss`,
  imports: [ViewListEventsComponent],
})
export class RouteListEventsComponent {
  public readonly data$ = signal<IEventModel[]>([]);
  public readonly connector = inject(ConnectorListEvents);

  constructor(
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService,
    private readonly pageService: PageListEventsResourceService,
    private readonly snackService: SnackbarService,
    private readonly dialog: MatDialog
  ) {
    this.watchForm()
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
    return this.pageService.listEvents(idTenant).pipe(
      map((res) => res.map((v) => EventDtoToModel(v))),
      tap((res) => this.data$.set(res))
    );
  }

  public goToEventDetails($event: IEventModel) {
    this.routingService.goToEventDetails($event.id);
  }
  public editEvent($event: IEventModel) {
    this.routingService.goToEditEvent($event.id);
  }
  public deleteEntry($event: IEventModel) {
    this.pageService
      .deleteEvent($event.id)
      .pipe(
        catchError((err) => {
          this.snackService.catchError(err, 'Erro ao deletar Evento.');
          return EMPTY;
        }),
        concatMap(() => this.lookupData$()),
        tap(() => this.snackService.showMessage('Evento deletado com sucesso.'))
      )
      .subscribe();
  }

  openCard($event: IEventModel) {
    this.dialog
      .open(EventCardDialogComponent, { data: $event })
      .afterClosed()
      .pipe()
      .subscribe();
  }
}