import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntityGetByIdResourceService, PageExtendedEventResourceService } from '@synergia-frontend/api';
import { RoutingService, SessionService } from '@synergia-frontend/services';

@Component({
    selector: 'app-route-event-details',
    templateUrl: './route-event-details.component.html',
    styleUrl: `./route-event-details.component.scss`,
})
export class RouteEventDetailsComponent {
  private readonly idEvent = signal<number | null>(null);

  constructor (
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService,
    private readonly entityService: EntityGetByIdResourceService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.getFromRouteParams()
  }

  private getFromRouteParams() {
    this.routingService.getParamFromRoute(this.activatedRoute, "id_event").then((id) => {
      if (id == null) {
        this.routingService.goToListEvents();
        return;
      } else {
        this.idEvent.set(Number(id));
        this.lookupEvent()
      }
    })
  }

  public lookupEvent() {
    const idEvent = this.idEvent();
    if (idEvent == null) return;
    this.entityService.getEventById(idEvent).pipe(
    ).subscribe()
  }
}