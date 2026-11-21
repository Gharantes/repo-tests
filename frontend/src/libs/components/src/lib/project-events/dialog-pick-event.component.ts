import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EntityEventResourceService } from '@synergia-frontend/api';
import { IEventModel } from '@synergia-frontend/interfaces';
import { EventDtoToModel } from '@synergia-frontend/mappers';
import { SessionService, SnackbarService } from '@synergia-frontend/services';
import { colorForId } from '../dialog-card/dialog-card.model';

interface PickEventData {
  /** Eventos em que o projeto já está; ficam fora da lista. */
  excludeIds: number[];
}

/** Escolhe um evento do tenant para registrar o projeto. Devolve o evento escolhido. */
@Component({
  selector: 'lib-dialog-pick-event',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="container">
      <h2 class="heading">Registrar em evento</h2>
      <label class="search">
        <mat-icon>search</mat-icon>
        <input placeholder="Buscar eventos…" [value]="query()" (input)="query.set($any($event.target).value)" />
      </label>
      <div class="list">
        @for (event of filtered(); track event.id) {
          <button type="button" class="option" (click)="pick(event)">
            <span class="thumb" [style.background]="event.bannerColor || colorFor(event.id)">{{ initial(event) }}</span>
            <span class="text">
              <strong>{{ event.title }}</strong>
              @if (event.description.trim()) {
                <small>{{ event.description }}</small>
              }
            </span>
            <mat-icon class="add">add</mat-icon>
          </button>
        } @empty {
          @if (loaded()) {
            <span class="empty">{{ query().trim() ? 'Nenhum evento encontrado.' : 'O projeto já está em todos os eventos.' }}</span>
          }
        }
      </div>
      <div class="buttons">
        <button mat-button type="button" (click)="close()">Cancelar</button>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; height: 100%; }
    .container { display: flex; flex-direction: column; gap: 12px; height: 100%; padding: 18px; box-sizing: border-box; }
    .heading { margin: 0; font-size: 18px; font-weight: 700; color: #121840; }
    .search { display: flex; align-items: center; gap: 8px; padding: 0 12px; height: 40px; border: 1px solid #dcd9d1;
      border-radius: 8px; color: #9a978f; }
    .search:focus-within { border-color: #3B52CC; }
    .search input { flex: 1; min-width: 0; border: 0; outline: 0; font: inherit; color: #33312c; background: transparent; }
    .list { flex: 1; min-height: 0; overflow: auto; display: flex; flex-direction: column; gap: 4px; }
    .option { display: flex; align-items: center; gap: 12px; padding: 8px; border: 0; border-radius: 8px; background: none;
      text-align: left; font: inherit; cursor: pointer; }
    .option:hover { background: #f3f2ee; }
    .thumb { display: inline-flex; align-items: center; justify-content: center; flex: none; width: 36px; height: 36px;
      border-radius: 8px; color: rgba(255, 255, 255, .9); font-weight: 800; }
    .text { display: flex; flex-direction: column; flex: 1; min-width: 0; }
    .text strong { font-size: 14px; color: #1b1f3a; }
    .text small { font-size: 12.5px; color: #9a978f; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .add { color: #9a978f; }
    .empty { padding: 8px; font-size: 0.85rem; color: #888; }
    .buttons { display: flex; justify-content: flex-end; }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DialogPickEventComponent {
  private readonly data: PickEventData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<DialogPickEventComponent, IEventModel>>(MatDialogRef);

  public readonly events = signal<IEventModel[]>([]);
  public readonly loaded = signal(false);
  public readonly query = signal('');
  public readonly colorFor = colorForId;
  public readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.events().filter((e) => !q || e.title.toLowerCase().includes(q));
  });

  public static open(dialog: MatDialog, excludeIds: number[]) {
    return dialog
      .open<DialogPickEventComponent, PickEventData, IEventModel>(DialogPickEventComponent, {
        data: { excludeIds },
        width: '520px',
        maxWidth: '100%',
        height: '560px',
        maxHeight: '100%',
      })
      .afterClosed();
  }

  constructor() {
    const idTenant = inject(SessionService).getTenantId()!;
    const snackbar = inject(SnackbarService);
    const exclude = new Set(this.data.excludeIds);
    inject(EntityEventResourceService)
      .listEventsByTenant(idTenant)
      .subscribe({
        next: (res) => {
          this.events.set(
            res
              .map((e) => EventDtoToModel(e))
              .filter((e) => !exclude.has(e.id))
              .sort((a, b) => a.title.localeCompare(b.title))
          );
          this.loaded.set(true);
        },
        error: (err) => snackbar.catchError(err, 'Erro ao carregar os eventos.'),
      });
  }

  public initial(event: IEventModel) {
    return (event.title?.trim()?.[0] ?? '#').toUpperCase();
  }

  public pick(event: IEventModel) {
    this.dialogRef.close(event);
  }

  public close() {
    this.dialogRef.close();
  }
}
