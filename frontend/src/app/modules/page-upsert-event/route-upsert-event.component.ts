import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { EntityEventResourceService } from '@synergia-frontend/api';
import { ConnectorUpsertEvent } from './connector/connector-upsert-event';
import { catchError, EMPTY, tap } from 'rxjs';
import { RoutingService, SnackbarService } from '@synergia-frontend/services';
import { ViewUpsertEventComponent } from './view/view-upsert-event.component';

/** Criar evento. A edição de um evento existente acontece em /event/:id (modo edição). */
@Component({
  selector: 'app-route-upsert-event',
  standalone: true,
  templateUrl: './route-upsert-event.component.html',
  styleUrl: `./route-upsert-event.component.scss`,
  imports: [ViewUpsertEventComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [ConnectorUpsertEvent],
})
export class RouteUpsertEventComponent {
  public readonly connector = inject(ConnectorUpsertEvent);
  private readonly routingService = inject(RoutingService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly entityEventService = inject(EntityEventResourceService);

  public goToParentRoute() {
    this.routingService.goToListEvents();
  }

  public save() {
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
}
