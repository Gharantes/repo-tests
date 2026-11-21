import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  changeDetection: ChangeDetectionStrategy.Eager,
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

  /**
   * O Angular reaproveita o componente quando só o :id muda
   * (ex.: /event/5 -> /event/6), então é preciso ouvir o paramMap
   * continuamente em vez de ler só o primeiro valor.
   */
  private getFromRouteParams() {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const id = params.get('id');
        if (id == null) {
          this.routingService.goToListEvents();
          return;
        }
        this.idEvent.set(Number(id));
        this.lookupEvent();
      });
  }

  public lookupEvent() {
    const idEvent = this.idEvent();
    if (idEvent == null) return;

    const lookupTags = true;
    const lookupMembers = true;

    this.entityService
      .getEventById(idEvent, lookupTags, lookupMembers)
      .pipe(
        map((res) => EventDtoToModel(res)),
        tap((res) => this.event$.set(res))
      )
      .subscribe();
  }

  public goToList() {
    this.routingService.goToListEvents();
  }

  public goToEdit(id: number) {
    this.routingService.goToEditEvent(id);
  }
}
