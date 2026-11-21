import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EntityProjectResourceService } from '@synergia-frontend/api';
import { IProjectModel } from '@synergia-frontend/interfaces';
import { ProjectDtoToModel } from '@synergia-frontend/mappers';
import { ProjectEventsService, RoutingService, SessionService, SnackbarService } from '@synergia-frontend/services';
import { map } from 'rxjs';
import { DialogPickEntityComponent } from './dialog-pick-entity.component';
import { EntityLinkListComponent, ILinkedEntity } from './entity-link-list.component';

/**
 * Projetos registrados no evento. Clicar abre o projeto. O usuário registra (botão "+" no cabeçalho
 * da seção, que chama `openAdd()`) e tira só os projetos de que participa.
 */
@Component({
  selector: 'lib-event-projects',
  standalone: true,
  imports: [EntityLinkListComponent],
  template: `
    <lib-entity-link-list
      [items]="projects()"
      [loaded]="loaded()"
      emptyText="Nenhum projeto registrado neste evento."
      removeLabel="Tirar do evento"
      [canRemove]="isMine"
      (openItem)="open($event)"
      (removeItem)="remove($event)"
    ></lib-entity-link-list>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class EventProjectsComponent {
  public readonly idEvent = input.required<number>();
  public readonly projects = signal<IProjectModel[]>([]);
  public readonly loaded = signal(false);
  /** Projetos de que o usuário participa. */
  private readonly myProjectIds = signal<Set<number>>(new Set());

  private readonly service = inject(ProjectEventsService);
  private readonly projectResource = inject(EntityProjectResourceService);
  private readonly routingService = inject(RoutingService);
  private readonly snackbar = inject(SnackbarService);
  private readonly dialog = inject(MatDialog);
  private readonly idAccount = inject(SessionService).getUserId()!;

  public readonly isMine = (item: ILinkedEntity) => this.myProjectIds().has(item.id);

  constructor() {
    effect(() => this.load(this.idEvent()));
    this.myProjects().subscribe({
      next: (res) => this.myProjectIds.set(new Set(res.map((p) => p.id))),
      error: (err) => this.snackbar.catchError(err, 'Erro ao carregar seus projetos.'),
    });
  }

  public open(project: ILinkedEntity) {
    this.routingService.goToProjectDetails(project.id);
  }

  /** Escolhe um dos projetos do usuário que ainda não está no evento e registra. */
  public openAdd() {
    DialogPickEntityComponent.open(this.dialog, {
      heading: 'Registrar projeto',
      searchPlaceholder: 'Buscar seus projetos…',
      emptyText: this.myProjectIds().size
        ? 'Todos os seus projetos já estão neste evento.'
        : 'Você ainda não participa de nenhum projeto.',
      options: this.myProjects(),
      excludeIds: this.projects().map((p) => p.id),
    }).subscribe((project) => {
      if (project == null) return;
      this.service.register(project.id, this.idEvent()).subscribe({
        next: () => this.load(this.idEvent()),
        error: (err) => this.snackbar.catchError(err, 'Erro ao registrar o projeto no evento.'),
      });
    });
  }

  public remove(project: ILinkedEntity) {
    if (!confirm(`Tirar o projeto "${project.title}" deste evento?`)) return;
    this.service.unregister(project.id, this.idEvent()).subscribe({
      next: () => this.projects.update((list) => list.filter((p) => p.id !== project.id)),
      error: (err) => this.snackbar.catchError(err, 'Erro ao tirar o projeto do evento.'),
    });
  }

  private myProjects() {
    return this.projectResource.listProjectsByAccount(this.idAccount).pipe(map((res) => res.map((p) => ProjectDtoToModel(p))));
  }

  private load(idEvent: number) {
    this.projectResource.listProjectsByEvent(idEvent).subscribe({
      next: (res) => {
        // Se trocou de evento enquanto carregava, descarta a resposta antiga.
        if (idEvent !== this.idEvent()) return;
        this.projects.set(res.map((p) => ProjectDtoToModel(p)));
        this.loaded.set(true);
      },
      error: (err) => this.snackbar.catchError(err, 'Erro ao carregar os projetos do evento.'),
    });
  }
}
