import { ChangeDetectionStrategy, Component, computed, OnDestroy, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EntityEventResourceService, EntityProjectResourceService } from '@synergia-frontend/api';
import { INoteModel, IUpsertNote, NoteParent, NoteType } from '@synergia-frontend/interfaces';
import { NoteService, RoutingService, SessionService, SnackbarService } from '@synergia-frontend/services';
import { formatDateTime } from '@synergia-frontend/utils';
import { firstValueFrom, Observable } from 'rxjs';

const SAVE_DELAY_MS = 600;

@Component({
  selector: 'app-route-lousa',
  templateUrl: './route-lousa.component.html',
  styleUrl: './route-lousa.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
})
export class RouteLousaComponent implements OnDestroy {
  public readonly formatDateTime = formatDateTime;
  public readonly colors = ['padrao', 'amarelo', 'verde', 'azul', 'rosa'];
  public readonly search = signal('');
  public readonly showArchived = signal(false);
  public readonly notes = signal<INoteModel[]>([]);
  public readonly projects = signal<{ id: number; title: string }[]>([]);
  public readonly events = signal<{ id: number; title: string }[]>([]);

  public readonly archivedCount = computed(() => this.notes().filter((n) => n.archivedAt).length);
  public readonly visible = computed(() =>
    this.notes()
      .filter((n) => !!n.archivedAt === this.showArchived() && matches(n, this.search()))
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.id - a.id)
  );

  private readonly idAccount: number;
  private readonly idTenant: number;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private queue = Promise.resolve();

  constructor(
    private readonly noteService: NoteService,
    private readonly snackbar: SnackbarService,
    public readonly routingService: RoutingService,
    sessionService: SessionService,
    projectService: EntityProjectResourceService,
    eventService: EntityEventResourceService
  ) {
    this.idAccount = sessionService.getUserId()!;
    this.idTenant = sessionService.getTenantId()!;
    noteService.listByAccount(this.idAccount).subscribe((res) => this.notes.set(res));
    projectService.listProjectsByAccount(this.idAccount).subscribe((res) => this.projects.set(res));
    eventService.listEventsByAccount(this.idAccount).subscribe((res) => this.events.set(res));
  }

  public setView(archived: boolean) {
    this.showArchived.set(archived);
    this.search.set('');
  }

  public create(type: NoteType) {
    const draft: INoteModel = {
      id: 0,
      idAccount: this.idAccount,
      authorName: '',
      type,
      title: '',
      content: '',
      items: type === 'LIST' ? [{ text: '', done: false }] : [],
      color: 'padrao',
      pinned: false,
      archivedAt: null,
      updatedAt: new Date().toISOString(),
      parentEntity: null,
      parentId: null,
      parentTitle: null,
    };
    this.enqueue(this.noteService.store(this.toUpsert(draft))).then((id) => {
      if (id != null) this.notes.update((list) => [{ ...draft, id }, ...list]);
    });
  }

  /** Atualiza na tela na hora e grava no servidor; texto espera uma pausa na digitação. */
  public patch(note: INoteModel, changes: Partial<INoteModel>, debounce = false) {
    this.notes.update((list) =>
      list.map((n) => (n.id === note.id ? { ...n, ...changes, updatedAt: new Date().toISOString() } : n))
    );
    clearTimeout(this.timers.get(note.id));
    this.timers.set(note.id, setTimeout(() => this.flush(note.id), debounce ? SAVE_DELAY_MS : 0));
  }

  public archive(note: INoteModel, archived: boolean) {
    this.patch(note, { archivedAt: archived ? new Date().toISOString() : null, pinned: false });
    if (!archived && this.archivedCount() === 0) this.setView(false);
  }

  public setItem(note: INoteModel, index: number, changes: Partial<INoteModel['items'][number]>, debounce = false) {
    this.patch(note, { items: note.items.map((it, i) => (i === index ? { ...it, ...changes } : it)) }, debounce);
  }

  public addItem(note: INoteModel) {
    this.patch(note, { items: [...note.items, { text: '', done: false }] });
  }

  public removeItem(note: INoteModel, index: number) {
    this.patch(note, { items: note.items.filter((_, i) => i !== index) });
  }

  /** Enter na última linha cria a próxima e põe o cursor nela. */
  public enterOnItem(note: INoteModel, index: number, event: Event) {
    event.preventDefault();
    if (index !== note.items.length - 1) return;
    const list = (event.target as HTMLElement).closest('.list');
    this.addItem(this.find(note.id)!);
    setTimeout(() => list?.querySelector<HTMLInputElement>('.item:last-of-type .item-text')?.focus());
  }

  public progress(note: INoteModel) {
    return { done: note.items.filter((i) => i.done).length, total: note.items.length };
  }

  public attach(note: INoteModel, parent?: { entity: NoteParent; id: number; title: string }) {
    this.enqueue(this.noteService.attach(note.id, this.idAccount, parent)).then((ok) => {
      if (ok === undefined) return;
      this.notes.update((list) =>
        list.map((n) =>
          n.id === note.id
            ? { ...n, parentEntity: parent?.entity ?? null, parentId: parent?.id ?? null, parentTitle: parent?.title ?? null }
            : n
        )
      );
    });
  }

  public goToParent(note: INoteModel) {
    if (note.parentEntity === 'PROJECT') this.routingService.goToProjectDetails(note.parentId!);
    if (note.parentEntity === 'EVENT') this.routingService.goToEventDetails(note.parentId!);
  }

  public remove(note: INoteModel) {
    const label = note.title ? `"${note.title}"` : 'este bloco';
    if (!confirm(`Apagar ${label}? Não tem como desfazer.`)) return;
    this.deleteNote(note);
    if (this.showArchived() && this.archivedCount() === 0) this.setView(false);
  }

  /** Ao sair da tela, grava o pendente e descarta blocos em branco. */
  public ngOnDestroy() {
    this.timers.forEach((timer, id) => {
      clearTimeout(timer);
      this.flush(id);
    });
    this.notes().filter(isEmpty).forEach((n) => this.deleteNote(n));
  }

  private deleteNote(note: INoteModel) {
    clearTimeout(this.timers.get(note.id));
    this.timers.delete(note.id);
    this.notes.update((list) => list.filter((n) => n.id !== note.id));
    this.enqueue(this.noteService.delete(note.id, this.idAccount));
  }

  private flush(idNote: number) {
    this.timers.delete(idNote);
    const note = this.find(idNote);
    if (note) this.enqueue(this.noteService.update(note.id, this.toUpsert(note)));
  }

  /** Uma requisição por vez, para a gravação mais nova nunca chegar antes da anterior. */
  private enqueue<T>(request: Observable<T>): Promise<T | undefined> {
    const result = this.queue.then(() => firstValueFrom(request, { defaultValue: undefined as T })).catch((err) => {
      this.snackbar.catchError(err, 'Erro ao gravar a lousa.');
      return undefined;
    });
    this.queue = result.then(() => undefined);
    return result;
  }

  private find(idNote: number) {
    return this.notes().find((n) => n.id === idNote);
  }

  private toUpsert(note: INoteModel): IUpsertNote {
    return {
      idTenant: this.idTenant,
      idAccount: this.idAccount,
      type: note.type,
      title: note.title,
      content: note.content,
      items: note.items,
      color: note.color,
      pinned: note.pinned,
      archived: !!note.archivedAt,
    };
  }
}

function isEmpty(note: INoteModel): boolean {
  return !note.title.trim() && !note.content.trim() && note.items.every((i) => !i.text.trim());
}

function matches(note: INoteModel, term: string): boolean {
  const normalize = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  const target = normalize([note.title, note.content, ...note.items.map((i) => i.text)].join(' '));
  return normalize(term).split(/\s+/).every((word) => target.includes(word));
}
