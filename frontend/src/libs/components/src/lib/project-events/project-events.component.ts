import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IEventModel } from '@synergia-frontend/interfaces';
import { EventDtoToModel } from '@synergia-frontend/mappers';
import { ProjectEventsService, RoutingService, SnackbarService } from '@synergia-frontend/services';
import { colorForId } from '../dialog-card/dialog-card.model';
import { SafeImageComponent } from '../safe-image/safe-image.component';
import { DialogPickEventComponent } from './dialog-pick-event.component';

/**
 * Eventos em que o projeto está registrado. Clicar abre o evento; dá para registrar em mais
 * (botão "+" no cabeçalho da seção, que chama `openAdd()`) e tirar de um evento.
 */
@Component({
  selector: 'lib-project-events',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, SafeImageComponent],
  template: `
    @for (event of events(); track event.id) {
      <article class="event">
        <button type="button" class="open" [matTooltip]="'Abrir ' + event.title" (click)="open(event)">
          <span class="cover" [style.background]="bg(event)">
            @if (event.bannerUrl) {
              <lib-safe-image [url]="event.bannerUrl" [altColor]="bg(event)"></lib-safe-image>
            } @else {
              {{ initial(event) }}
            }
          </span>
          <span class="text">
            <strong>{{ event.title }}</strong>
            @if (event.description.trim()) {
              <small>{{ event.description }}</small>
            }
          </span>
        </button>
        <button type="button" class="action" matTooltip="Tirar do evento" aria-label="Tirar do evento" (click)="remove(event)">
          <mat-icon>close</mat-icon>
        </button>
      </article>
    } @empty {
      @if (loaded()) {
        <span class="empty">Este projeto ainda não está em nenhum evento.</span>
      }
    }
  `,
  styles: `
    :host { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; }
    .event { display: flex; align-items: center; gap: 4px; padding: 6px 6px 6px 8px; border: 1px solid #e8e4dc;
      border-radius: 10px; background: #fff; min-width: 0; }
    .event:hover { border-color: #cfcbc1; }
    .open { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; padding: 0; border: 0; background: none;
      text-align: left; font: inherit; cursor: pointer; }
    .cover { display: inline-flex; align-items: center; justify-content: center; flex: none; width: 40px; height: 40px;
      overflow: hidden; border-radius: 8px; color: rgba(255, 255, 255, .9); font-weight: 800; }
    .cover lib-safe-image { display: block; width: 100%; height: 100%; }
    .text { display: flex; flex-direction: column; min-width: 0; line-height: 1.3; }
    .text strong { font-size: 14px; color: #1b1f3a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .text small { font-size: 12px; color: #9a978f; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .action { display: inline-flex; flex: none; border: 0; background: none; color: #8a877f; cursor: pointer; padding: 4px; border-radius: 6px; }
    .action:hover { background: rgba(0, 0, 0, .06); color: #333; }
    .action mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .empty { grid-column: 1 / -1; font-size: 0.85rem; color: #888; }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ProjectEventsComponent {
  public readonly idProject = input.required<number>();
  public readonly events = signal<IEventModel[]>([]);
  public readonly loaded = signal(false);

  constructor(
    private readonly service: ProjectEventsService,
    private readonly routingService: RoutingService,
    private readonly snackbar: SnackbarService,
    private readonly dialog: MatDialog
  ) {
    effect(() => this.load(this.idProject()));
  }

  public bg(event: IEventModel) {
    return event.bannerColor || colorForId(event.id);
  }

  public initial(event: IEventModel) {
    return (event.title?.trim()?.[0] ?? '#').toUpperCase();
  }

  public open(event: IEventModel) {
    this.routingService.goToEventDetails(event.id);
  }

  /** Escolhe um evento que o projeto ainda não tem e registra. */
  public openAdd() {
    DialogPickEventComponent.open(this.dialog, this.events().map((e) => e.id)).subscribe((event) => {
      if (event == null) return;
      this.service.register(this.idProject(), event.id).subscribe({
        next: () => this.load(this.idProject()),
        error: (err) => this.snackbar.catchError(err, 'Erro ao registrar o projeto no evento.'),
      });
    });
  }

  public remove(event: IEventModel) {
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
