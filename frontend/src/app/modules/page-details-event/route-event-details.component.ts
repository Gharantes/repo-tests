import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { EntityEventResourceService, EntityGetByIdResourceService } from '@synergia-frontend/api';
import { EntityChangesService, PermissionService, RoutingService, SnackbarService } from '@synergia-frontend/services';
import { catchError, EMPTY, map, tap } from 'rxjs';
import { EventDtoToModel } from '@synergia-frontend/mappers';
import { IEventModel } from '@synergia-frontend/interfaces';
import { ViewEventDetailsComponent } from './view/view-event-details.component';
import { ConnectorUpsertEvent } from '../page-upsert-event/connector/connector-upsert-event';

/**
 * Página do evento. "Editar evento" troca o topo da página (capa, título,
 * propriedades e descrição) por campos, sem sair daqui; as abas continuam abaixo.
 * `?edit=1` abre a página já em modo edição (é para onde aponta goToEditEvent).
 */
@Component({
  selector: 'app-route-event-details',
  templateUrl: './route-event-details.component.html',
  styleUrl: `./route-event-details.component.scss`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ViewEventDetailsComponent],
  providers: [ConnectorUpsertEvent],
})
export class RouteEventDetailsComponent {
  public readonly connector = inject(ConnectorUpsertEvent);
  private readonly routingService = inject(RoutingService);
  public readonly permissions = inject(PermissionService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly entityChanges = inject(EntityChangesService);
  private readonly entityService = inject(EntityGetByIdResourceService);
  private readonly entityEventService = inject(EntityEventResourceService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly idEvent = signal<number | null>(null);
  public readonly event$ = signal<IEventModel | null>(null);
  public readonly editing = signal(false);
  /** `?tab=feed|lousa|projetos|calendario`: muda de aba mesmo com a página já aberta (aviso do sino). */
  public readonly openTab = toSignal(this.activatedRoute.queryParamMap.pipe(map((q) => q.get('tab'))), {
    initialValue: null,
  });

  constructor() {
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
        this.editing.set(false);
        this.lookupEvent(this.activatedRoute.snapshot.queryParamMap.has('edit'));
      });
  }

  public lookupEvent(openEditing = false) {
    const idEvent = this.idEvent();
    if (idEvent == null) return;

    const lookupTags = true;
    const lookupMembers = true;

    this.entityService
      .getEventById(idEvent, lookupTags, lookupMembers)
      .pipe(
        map((res) => EventDtoToModel(res)),
        tap((res) => {
          this.event$.set(res);
          if (openEditing) this.startEditing();
        })
      )
      .subscribe();
  }

  public goToList() {
    this.routingService.goToListEvents();
  }

  public startEditing() {
    const event = this.event$();
    if (event == null) return;
    if (!this.permissions.canEditEvent(event)) {
      this.clearEditParam();
      return;
    }
    this.connector.populateForm(event);
    this.editing.set(true);
    this.clearEditParam();
  }

  public cancelEditing() {
    this.editing.set(false);
  }

  public save() {
    const id = this.idEvent();
    const obj = this.connector.getFormValue();
    if (id == null || obj == null || this.connector.form.invalid) return;

    this.entityEventService
      .updateEvent(id, obj)
      .pipe(
        tap(() => {
          this.snackbarService.showMessage('Evento atualizado.');
          this.editing.set(false);
          this.lookupEvent();
          this.entityChanges.notifyEventsChanged();
        }),
        catchError((err) => {
          this.snackbarService.catchError(err);
          return EMPTY;
        })
      )
      .subscribe();
  }

  /** Tira o ?edit=1 da URL, para que recarregar a página depois de salvar não volte ao modo edição. */
  private clearEditParam() {
    if (!this.activatedRoute.snapshot.queryParamMap.has('edit')) return;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { edit: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
