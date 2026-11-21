import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EntityEventResourceService } from '@synergia-frontend/api';
import { IEventModel } from '@synergia-frontend/interfaces';
import { EventDtoToModel } from '@synergia-frontend/mappers';
import { ProjectEventsService, RoutingService, SessionService, SnackbarService } from '@synergia-frontend/services';
import { map } from 'rxjs';
import { DialogPickEntityComponent } from './dialog-pick-entity.component';
import { EntityLinkListComponent, ILinkedEntity } from './entity-link-list.component';

/**
 * Eventos em que o projeto está registrado. Clicar abre o evento; dá para registrar em mais
 * (botão "+" no cabeçalho da seção, que chama `openAdd()`) e tirar de um evento.
 */
@Component({
  selector: 'lib-project-events',
  standalone: true,
  imports: [EntityLinkListComponent],
  template: `
    <lib-entity-link-list
      [items]="events()"
      [loaded]="loaded()"
      emptyText="Este projeto ainda não está em nenhum evento."
      removeLabel="Tirar do evento"
      (openItem)="open($event)"
      (removeItem)="remove($event)"
    ></lib-entity-link-list>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ProjectEventsComponent {
  public readonly idProject = input.required<number>();
  public readonly events = signal<IEventModel[]>([]);
  public readonly loaded = signal(false);

  private readonly service = inject(ProjectEventsService);
  private readonly eventResource = inject(EntityEventResourceService);
  private readonly routingService = inject(RoutingService);
  private readonly snackbar = inject(SnackbarService);
  private readonly dialog = inject(MatDialog);
  private readonly idTenant = inject(SessionService).getTenantId()!;

  constructor() {
    effect(() => this.load(this.idProject()));
  }

  public open(event: ILinkedEntity) {
    this.routingService.goToEventDetails(event.id);
  }

  /** Escolhe um evento do tenant que o projeto ainda não tem e registra. */
  public openAdd() {
    DialogPickEntityComponent.open(this.dialog, {
      heading: 'Registrar em evento',
      searchPlaceholder: 'Buscar eventos…',
      emptyText: 'O projeto já está em todos os eventos.',
      options: this.eventResource.listEventsByTenant(this.idTenant).pipe(map((res) => res.map((e) => EventDtoToModel(e)))),
      excludeIds: this.events().map((e) => e.id),
    }).subscribe((event) => {
      if (event == null) return;
      this.service.register(this.idProject(), event.id).subscribe({
        next: () => this.load(this.idProject()),
        error: (err) => this.snackbar.catchError(err, 'Erro ao registrar o projeto no evento.'),
      });
    });
  }

  public remove(event: ILinkedEntity) {
    if (!confirm(`Tirar o projeto do evento "${event.title}"?`)) return;
    this.service.unregister(this.idProject(), event.id).subscribe({
      next: () => this.events.update((list) => list.filter((e) => e.id !== event.id)),
      error: (err) => this.snackbar.catchError(err, 'Erro ao tirar o projeto do evento.'),
    });
  }

  private load(idProject: number) {
    this.service.listEventsOfProject(idProject).subscribe({
      next: (res) => {
        // Se trocou de projeto enquanto carregava, descarta a resposta antiga.
        if (idProject !== this.idProject()) return;
        this.events.set(res.map((e) => EventDtoToModel(e)));
        this.loaded.set(true);
      },
      error: (err) => this.snackbar.catchError(err, 'Erro ao carregar os eventos do projeto.'),
    });
  }
}
