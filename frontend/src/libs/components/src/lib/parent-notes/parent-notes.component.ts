import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { INoteModel, NoteParent } from '@synergia-frontend/interfaces';
import { NoteService } from '@synergia-frontend/services';
import { formatDateTime } from '@synergia-frontend/utils';

/** Blocos da lousa vinculados a um projeto ou evento, só leitura. */
@Component({
  selector: 'lib-parent-notes',
  standalone: true,
  template: `
    @for (note of notes(); track note.id) {
      <article class="note" [class]="'note--' + note.color">
        @if (note.title) {
          <strong>{{ note.title }}</strong>
        }
        @if (note.type === 'LIST') {
          @for (item of note.items; track $index) {
            <label class="item" [class.done]="item.done">
              <input type="checkbox" [checked]="item.done" disabled />
              {{ item.text }}
            </label>
          }
        } @else {
          <p>{{ note.content }}</p>
        }
        <small>{{ note.authorName }} · {{ formatDateTime(note.updatedAt) }}</small>
      </article>
    } @empty {
      <span class="empty">Nenhum bloco da lousa vinculado.</span>
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
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ParentNotesComponent {
  public readonly parentEntity = input.required<NoteParent>();
  public readonly parentId = input.required<number>();
  public readonly notes = signal<INoteModel[]>([]);
  public readonly formatDateTime = formatDateTime;

  constructor(private readonly noteService: NoteService) {
    effect(() => {
      this.noteService
        .listOfParent(this.parentEntity(), this.parentId())
        .subscribe((res) => this.notes.set(res));
    });
  }
}
