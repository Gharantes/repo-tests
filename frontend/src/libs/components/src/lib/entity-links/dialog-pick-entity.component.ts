import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from '@synergia-frontend/services';
import { Observable } from 'rxjs';
import { colorForId } from '../dialog-card/dialog-card.model';

/** O mínimo de um projeto ou evento para aparecer na lista. */
export interface IPickEntity {
  id: number;
  title: string;
  description: string;
  bannerColor: string;
}

export interface PickEntityData {
  heading: string;
  searchPlaceholder: string;
  /** Mostrado quando não sobra nada para escolher (sem busca). */
  emptyText: string;
  options: Observable<IPickEntity[]>;
  /** Já vinculados; ficam fora da lista. */
  excludeIds: number[];
}

/** Escolhe um projeto ou evento de uma lista com busca. Devolve o escolhido. */
@Component({
  selector: 'lib-dialog-pick-entity',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="container">
      <h2 class="heading">{{ data.heading }}</h2>
      <label class="search">
        <mat-icon>search</mat-icon>
        <input [placeholder]="data.searchPlaceholder" [value]="query()" (input)="query.set($any($event.target).value)" />
      </label>
      <div class="list">
        @for (item of filtered(); track item.id) {
          <button type="button" class="option" (click)="pick(item)">
            <span class="thumb" [style.background]="item.bannerColor || colorFor(item.id)">{{ initial(item) }}</span>
            <span class="text">
              <strong>{{ item.title }}</strong>
              @if (item.description.trim()) {
                <small>{{ item.description }}</small>
              }
            </span>
            <mat-icon class="add">add</mat-icon>
          </button>
        } @empty {
          @if (loaded()) {
            <span class="empty">{{ query().trim() ? 'Nada encontrado.' : data.emptyText }}</span>
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
export class DialogPickEntityComponent {
  public readonly data: PickEntityData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<DialogPickEntityComponent, IPickEntity>>(MatDialogRef);

  public readonly items = signal<IPickEntity[]>([]);
  public readonly loaded = signal(false);
  public readonly query = signal('');
  public readonly colorFor = colorForId;
  public readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.items().filter((e) => !q || e.title.toLowerCase().includes(q));
  });

  public static open(dialog: MatDialog, data: PickEntityData) {
    return dialog
      .open<DialogPickEntityComponent, PickEntityData, IPickEntity>(DialogPickEntityComponent, {
        data,
        width: '520px',
        maxWidth: '100%',
        height: '560px',
        maxHeight: '100%',
      })
      .afterClosed();
  }

  constructor() {
    const snackbar = inject(SnackbarService);
    const exclude = new Set(this.data.excludeIds);
    this.data.options.subscribe({
      next: (res) => {
        this.items.set(res.filter((e) => !exclude.has(e.id)).sort((a, b) => a.title.localeCompare(b.title)));
        this.loaded.set(true);
      },
      error: (err) => snackbar.catchError(err, 'Erro ao carregar a lista.'),
    });
  }

  public initial(item: IPickEntity) {
    return (item.title?.trim()?.[0] ?? '#').toUpperCase();
  }

  public pick(item: IPickEntity) {
    this.dialogRef.close(item);
  }

  public close() {
    this.dialogRef.close();
  }
}
