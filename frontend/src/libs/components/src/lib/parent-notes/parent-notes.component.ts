import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EntityProjectResourceService, ProjectDto } from '@synergia-frontend/api';
import { INoteItem, INoteModel, IUpsertNote, NoteParent, NoteType } from '@synergia-frontend/interfaces';
import { ProjectDtoToModel } from '@synergia-frontend/mappers';
import { NoteService, SessionService, SnackbarService } from '@synergia-frontend/services';
import { formatDateTime } from '@synergia-frontend/utils';
import { combineLatest, firstValueFrom, map } from 'rxjs';
import { DialogPickEntityComponent } from '../entity-links/dialog-pick-entity.component';

const COLORS = ['padrao', 'amarelo', 'verde', 'azul', 'rosa'];

/** Bloco em edição: sem id é um bloco novo; com id, um existente do próprio usuário. */
interface INoteDraft {
  id?: number;
  type: NoteType;
  title: string;
  content: string;
  items: INoteItem[];
  color: string;
}

/**
 * Blocos da lousa vinculados a um projeto ou evento.
 * Dá para criar um bloco já vinculado; os do próprio usuário podem ser editados, recoloridos e apagados.
 */
@Component({
  selector: 'lib-parent-notes',
  standalone: true,
  imports: [NgTemplateOutlet, MatIconModule, MatMenuModule, MatTooltipModule],
  template: `
    <ng-template #editor let-d>
      <article class="note draft" [class]="'note--' + d.color" #draftCard>
        <header class="top">
          <input
            class="title-input"
            placeholder="Título (opcional)"
            [value]="d.title"
            (input)="setDraft({ title: $any($event.target).value })"
          />
          <button type="button" class="action" matTooltip="Cor" [matMenuTriggerFor]="draftColorMenu">
            <mat-icon>palette</mat-icon>
          </button>
          <mat-menu #draftColorMenu="matMenu">
            @for (color of colors; track color) {
              <button mat-menu-item (click)="setDraft({ color })">
                <span class="swatch" [class]="'note--' + color"></span>{{ colorLabel(color) }}
              </button>
            }
          </mat-menu>
        </header>
        @if (d.type === 'LIST') {
          @for (item of d.items; track $index; let i = $index) {
            <div class="item">
              <input type="checkbox" [checked]="item.done" (change)="setItem(i, { done: !item.done })" />
              <input
                class="item-text"
                placeholder="Escreva um passo…"
                [value]="item.text"
                (input)="setItem(i, { text: $any($event.target).value })"
                (keydown.enter)="enterOnItem(i, $event)"
              />
              <button type="button" class="action mini" matTooltip="Remover linha" (click)="removeItem(i)">
                <mat-icon>close</mat-icon>
              </button>
            </div>
          }
          <button type="button" class="link" (click)="addItem()">+ Nova linha</button>
        } @else {
          <textarea
            placeholder="Anotação…"
            rows="4"
            [value]="d.content"
            (input)="setDraft({ content: $any($event.target).value })"
          ></textarea>
        }
        <div class="buttons">
          <button type="button" class="link" [disabled]="saving()" (click)="cancel()">Cancelar</button>
          <button type="button" class="save" [disabled]="saving() || isEmpty(d)" (click)="save()">Salvar</button>
        </div>
      </article>
    </ng-template>

    <ng-content></ng-content>
    @if (draft(); as d) {
      @if (d.id == null) {
        <ng-container *ngTemplateOutlet="editor; context: { $implicit: d }"></ng-container>
      }
    }
    @for (note of notes(); track note.id) {
      @if (draft()?.id === note.id) {
        <ng-container *ngTemplateOutlet="editor; context: { $implicit: draft() }"></ng-container>
      } @else {
        <article class="note" [class]="'note--' + note.color">
          @if (note.title || isMine(note) || canCopy()) {
            <header class="top">
              @if (note.title) {
                <strong class="title">{{ note.title }}</strong>
              }
              <div class="tools">
                @if (canCopy()) {
                  <button type="button" class="action" matTooltip="Copiar para um projeto" (click)="copyToProject(note)">
                    <mat-icon>content_copy</mat-icon>
                  </button>
                }
                @if (isMine(note)) {
                  <button type="button" class="action" matTooltip="Editar" (click)="edit(note)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button type="button" class="action" matTooltip="Cor" [matMenuTriggerFor]="colorMenu">
                    <mat-icon>palette</mat-icon>
                  </button>
                  <mat-menu #colorMenu="matMenu">
                    @for (color of colors; track color) {
                      <button mat-menu-item (click)="recolor(note, color)">
                        <span class="swatch" [class]="'note--' + color"></span>{{ colorLabel(color) }}
                      </button>
                    }
                  </mat-menu>
                  <button type="button" class="action" matTooltip="Apagar" (click)="remove(note)">
                    <mat-icon>delete</mat-icon>
                  </button>
                }
              </div>
            </header>
          }
          @if (note.type === 'LIST') {
            @for (item of note.items; track $index; let i = $index) {
              <label class="item" [class.done]="item.done">
                <input type="checkbox" [checked]="item.done" [disabled]="!isMine(note)" (change)="toggleItem(note, i)" />
                {{ item.text }}
              </label>
            }
          } @else {
            <p>{{ note.content }}</p>
          }
          <small>{{ note.authorName }} · {{ formatDateTime(note.updatedAt) }}</small>
        </article>
      }
    } @empty {
      @if (!draft()) {
        <span class="empty">Nenhum bloco da lousa vinculado.</span>
      }
    }
  `,
  styles: `
    :host { display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start; }
    .note { width: 240px; padding: 12px; border-radius: 8px; border: 1px solid #e8e4dc;
      display: flex; flex-direction: column; gap: 6px; font-size: 0.85rem; color: #333; }
    .note p { margin: 0; white-space: pre-wrap; }
    .note small { color: #777; }
    .item { display: flex; gap: 6px; align-items: center; }
    .item.done { text-decoration: line-through; color: #888; }
    .empty { font-size: 0.85rem; color: #888; }
    .note--padrao { background: #fff; }
    .note--amarelo { background: #fff4c2; }
    .note--verde { background: #d9f2dc; }
    .note--azul { background: #dbe8fb; }
    .note--rosa { background: #fadbe6; }

    .top { display: flex; align-items: center; gap: 2px; }
    .top .title { flex: 1; min-width: 0; overflow-wrap: anywhere; }
    .tools { display: flex; gap: 2px; margin: -4px -6px -4px auto; }
    .action { display: inline-flex; border: 0; background: none; color: #8a877f; cursor: pointer; padding: 3px; border-radius: 4px; }
    .action:hover { background: rgba(0, 0, 0, .06); color: #333; }
    .action mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .action.mini mat-icon { font-size: 15px; width: 15px; height: 15px; }
    .swatch { display: inline-block; width: 14px; height: 14px; border-radius: 50%; border: 1px solid #ccc; margin-right: 8px; vertical-align: middle; }

    .draft { border-style: dashed; border-color: #cfcbc1; }
    .draft input, .draft textarea { font: inherit; color: inherit; border: 0; outline: 0; background: transparent; padding: 0; }
    .draft .title-input { flex: 1; min-width: 0; font-weight: 700; }
    .draft textarea { resize: vertical; }
    .draft .item-text { flex: 1; min-width: 0; }
    .draft .link { align-self: flex-start; border: 0; background: none; color: #555; cursor: pointer; padding: 2px 0; font: inherit; }
    .buttons { display: flex; justify-content: flex-end; gap: 10px; margin-top: 4px; }
    .save { border: 0; border-radius: 6px; padding: 5px 12px; background: #121840; color: #fff; cursor: pointer; font: inherit; }
    .save:disabled { opacity: .45; cursor: default; }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ParentNotesComponent {
  public readonly parentEntity = input.required<NoteParent>();
  public readonly parentId = input.required<number>();
  public readonly notes = signal<INoteModel[]>([]);
  public readonly draft = signal<INoteDraft | null>(null);
  public readonly saving = signal(false);
  public readonly colors = COLORS;
  public readonly formatDateTime = formatDateTime;

  private readonly dialog = inject(MatDialog);
  private readonly projectResource = inject(EntityProjectResourceService);

  /** Só na lousa do evento: copia o bloco para um projeto registrado nele. O contrário não existe. */
  public canCopy() {
    return this.parentEntity() === 'EVENT';
  }

  private readonly draftCard = viewChild<ElementRef<HTMLElement>>('draftCard');
  private readonly idAccount: number;
  private readonly idTenant: number;

  constructor(
    private readonly noteService: NoteService,
    private readonly snackbar: SnackbarService,
    sessionService: SessionService
  ) {
    this.idAccount = sessionService.getUserId()!;
    this.idTenant = sessionService.getTenantId()!;
    effect(() => this.load());
  }

  public isMine(note: INoteModel) {
    return note.idAccount === this.idAccount;
  }

  public colorLabel(color: string) {
    return color === 'padrao' ? 'Sem cor' : color;
  }

  /** Abre um bloco novo no começo da lista; se já havia um novo aberto, só troca o tipo. */
  public startDraft(type: NoteType) {
    const current = this.draft()?.id == null ? this.draft() : null;
    this.draft.set({
      type,
      title: current?.title ?? '',
      content: current?.content ?? '',
      items: current?.items.length ? current.items : [{ text: '', done: false }],
      color: current?.color ?? 'padrao',
    });
    this.focusDraft();
  }

  public edit(note: INoteModel) {
    this.draft.set({
      id: note.id,
      type: note.type,
      title: note.title,
      content: note.content,
      items: note.items.length ? note.items.map((i) => ({ ...i })) : [{ text: '', done: false }],
      color: note.color,
    });
    this.focusDraft();
  }

  public setDraft(changes: Partial<INoteDraft>) {
    this.draft.update((d) => (d ? { ...d, ...changes } : d));
  }

  public setItem(index: number, changes: Partial<INoteItem>) {
    this.draft.update((d) => (d ? { ...d, items: d.items.map((it, i) => (i === index ? { ...it, ...changes } : it)) } : d));
  }

  public addItem() {
    this.draft.update((d) => (d ? { ...d, items: [...d.items, { text: '', done: false }] } : d));
  }

  public removeItem(index: number) {
    this.draft.update((d) => (d ? { ...d, items: d.items.filter((_, i) => i !== index) } : d));
  }

  /** Enter na última linha cria a próxima e põe o cursor nela. */
  public enterOnItem(index: number, event: Event) {
    event.preventDefault();
    if (index !== this.draft()!.items.length - 1) return;
    this.addItem();
    setTimeout(() => {
      const inputs = this.draftCard()?.nativeElement.querySelectorAll<HTMLInputElement>('.item-text');
      inputs?.[inputs.length - 1]?.focus();
    });
  }

  public cancel() {
    this.draft.set(null);
  }

  public isEmpty(d: INoteDraft): boolean {
    return !d.title.trim() && (d.type === 'LIST' ? d.items.every((i) => !i.text.trim()) : !d.content.trim());
  }

  /** Bloco novo: cria na lousa do usuário e já vincula a este projeto/evento. Existente: grava as mudanças. */
  public async save() {
    const d = this.draft();
    if (!d || this.isEmpty(d)) return;
    const upsert = this.toUpsert({
      ...d,
      title: d.title.trim(),
      content: d.type === 'TEXT' ? d.content : '',
      items: d.type === 'LIST' ? d.items.filter((i) => i.text.trim()) : [],
    });
    this.saving.set(true);
    try {
      if (d.id != null) {
        await firstValueFrom(this.noteService.update(d.id, upsert), { defaultValue: undefined });
      } else {
        const id = await firstValueFrom(this.noteService.store(upsert));
        await firstValueFrom(
          this.noteService.attach(id, this.idAccount, { entity: this.parentEntity(), id: this.parentId() }),
          { defaultValue: undefined }
        );
      }
      this.draft.set(null);
      this.load();
    } catch (err) {
      this.snackbar.catchError(err, 'Erro ao gravar o bloco.');
    } finally {
      this.saving.set(false);
    }
  }

  /**
   * Escolhe um projeto que está registrado neste evento e de que o usuário participa, e cria nele
   * uma cópia do bloco na lousa do usuário. O original continua no evento.
   */
  public copyToProject(note: INoteModel) {
    const idEvent = this.parentId();
    const toModels = map((res: ProjectDto[]) => res.map((p) => ProjectDtoToModel(p)));
    const options = combineLatest([
      this.projectResource.listProjectsByEvent(idEvent).pipe(toModels),
      this.projectResource.listProjectsByAccount(this.idAccount).pipe(toModels),
    ]).pipe(
      map(([ofEvent, mine]) => {
        const myIds = new Set(mine.map((p) => p.id));
        return ofEvent.filter((p) => myIds.has(p.id));
      })
    );
    DialogPickEntityComponent.open(this.dialog, {
      heading: 'Copiar para um projeto',
      searchPlaceholder: 'Buscar seus projetos neste evento…',
      emptyText: 'Nenhum projeto seu está registrado neste evento.',
      options,
      excludeIds: [],
      pickIcon: 'content_copy',
    }).subscribe(async (project) => {
      if (project == null) return;
      try {
        const id = await firstValueFrom(this.noteService.store(this.toUpsert(note)));
        await firstValueFrom(this.noteService.attach(id, this.idAccount, { entity: 'PROJECT', id: project.id }), {
          defaultValue: undefined,
        });
        this.snackbar.showMessage(`Bloco copiado para "${project.title}".`, true);
      } catch (err) {
        this.snackbar.catchError(err, 'Erro ao copiar o bloco.');
      }
    });
  }

  public recolor(note: INoteModel, color: string) {
    this.quickUpdate(note, { color });
  }

  public toggleItem(note: INoteModel, index: number) {
    this.quickUpdate(note, { items: note.items.map((it, i) => (i === index ? { ...it, done: !it.done } : it)) });
  }

  public remove(note: INoteModel) {
    const label = note.title ? `"${note.title}"` : 'este bloco';
    if (!confirm(`Apagar ${label}? Não tem como desfazer.`)) return;
    this.noteService.delete(note.id, this.idAccount).subscribe({
      next: () => this.notes.update((list) => list.filter((n) => n.id !== note.id)),
      error: (err) => this.snackbar.catchError(err, 'Erro ao apagar o bloco.'),
    });
  }

  /** Mostra a mudança na hora e grava; se falhar, recarrega do servidor. */
  private quickUpdate(note: INoteModel, changes: Partial<INoteModel>) {
    const next = { ...note, ...changes, updatedAt: new Date().toISOString() };
    this.notes.update((list) => list.map((n) => (n.id === note.id ? next : n)));
    this.noteService.update(note.id, this.toUpsert(next)).subscribe({
      error: (err) => {
        this.snackbar.catchError(err, 'Erro ao gravar o bloco.');
        this.load();
      },
    });
  }

  private toUpsert(note: Pick<INoteModel, 'type' | 'title' | 'content' | 'items' | 'color'>): IUpsertNote {
    return {
      idTenant: this.idTenant,
      idAccount: this.idAccount,
      type: note.type,
      title: note.title,
      content: note.content,
      items: note.items,
      color: note.color,
      pinned: false,
      archived: false,
    };
  }

  private focusDraft() {
    setTimeout(() => this.draftCard()?.nativeElement.querySelector<HTMLElement>('textarea, .item-text')?.focus());
  }

  private load() {
    this.noteService.listOfParent(this.parentEntity(), this.parentId()).subscribe((res) => this.notes.set(res));
  }
}
