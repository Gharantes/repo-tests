import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntityGetByIdResourceService } from '@synergia-frontend/api';
import { RoutingService, SessionService } from '@synergia-frontend/services';
import { map, tap } from 'rxjs';
import { EventDtoToModel } from '@synergia-frontend/mappers';
import { IEventModel } from '@synergia-frontend/interfaces';
import { ViewEventDetailsComponent } from './view/view-event-details.component';

@Component({
  selector: 'app-route-event-details',
  templateUrl: './route-event-details.component.html',
  styleUrl: `./route-event-details.component.scss`,
  imports: [ViewEventDetailsComponent],
})
export class RouteEventDetailsComponent {
  private readonly idEvent = signal<number | null>(null);
  public readonly event$ = signal<IEventModel | null>(null);

  constructor(
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService,
    private readonly entityService: EntityGetByIdResourceService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.getFromRouteParams();
  }

  private getFromRouteParams() {
    this.routingService
      .getParamFromRoute(this.activatedRoute, 'id')
      .then((id) => {
        if (id == null) {
          this.routingService.goToListEvents();
          return;
        } else {
          this.idEvent.set(Number(id));
          this.lookupEvent();
        }
      });
  }

  public lookupEvent() {
    const idEvent = this.idEvent();
    if (idEvent == null) return;
    this.entityService
      .getEventById(idEvent, true)
      .pipe(
        map((res) => EventDtoToModel(res)),
        tap((res) => this.event$.set(res))
      )
      .subscribe();
  }
}