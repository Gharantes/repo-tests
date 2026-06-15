import { Component, inject, signal } from '@angular/core';
import {
  EntityEventResourceService,
  EntityGetByIdResourceService,
} from '@synergia-frontend/api';
import { ConnectorUpsertEvent } from './connector/connector-upsert-event';
import { catchError, EMPTY, map, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import { ViewUpsertEventComponent } from './view/view-upsert-event.component';
import { EventDtoToModel } from '@synergia-frontend/mappers';

@Component({
  selector: 'app-route-upsert-event',
  standalone: true,
  templateUrl: './route-upsert-event.component.html',
  styleUrl: `./route-upsert-event.component.scss`,
  imports: [ViewUpsertEventComponent],
  providers: [ConnectorUpsertEvent],
})
export class RouteUpsertEventComponent {
  public readonly connector = inject(ConnectorUpsertEvent);
  public readonly idEvent = signal<number | null>(null);

  constructor(
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService,
    private readonly snackbarService: SnackbarService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly entityEventService: EntityEventResourceService,
    private readonly entityService: EntityGetByIdResourceService
  ) {
    this.getIdFromRoute();
  }

  private getIdFromRoute() {
    this.routingService
      .getParamFromRoute(this.activatedRoute, 'id')
      .then((id) => {
        this.idEvent.set(id ? Number(id) : null);
        this.getById();
      });
  }

  public goToParentRoute() {
    this.routingService.goToListEvents();
  }
  public save() {
    const idEvent = this.idEvent();
    if (idEvent) {
      this.update(idEvent);
    } else {
      this.insert();
    }
  }
  public insert() {
    const obj = this.connector.getFormValue();
    if (obj == null) return;
    this.entityEventService
      .createEvent(obj)
      .pipe(
        tap(() => {
          this.snackbarService.showMessage('Evento registrado.');
          this.goToParentRoute();
        }),
        catchError((err) => {
          this.snackbarService.catchError(err);
          return EMPTY;
        })
      )
      .subscribe();
  }
  public update(idEvent: number) {
    const obj = this.connector.getFormValue();
    if (obj == null) return;
    this.entityEventService
      .updateEvent(idEvent, obj)
      .pipe(
        tap(() => {
          this.snackbarService.showMessage('Evento atualizado.');
          this.goToParentRoute();
        }),
        catchError((err) => {
          this.snackbarService.catchError(err);
          return EMPTY;
        })
      )
      .subscribe();
  }
  public getById() {
    const id = this.idEvent();
    if (id == null) return;

    const lookupTags = true;
    const lookupMembers = false;

    this.entityService
      .getEventById(id, lookupTags, lookupMembers)
      .pipe(
        map((res) => EventDtoToModel(res)),
        tap((res) => this.connector.populateForm(res))
      )
      .subscribe();
  }
}