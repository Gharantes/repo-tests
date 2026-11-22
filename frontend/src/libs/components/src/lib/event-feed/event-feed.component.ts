import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IPostDraft, IPostModel } from '@synergia-frontend/interfaces';
import { PostService, SessionService, SnackbarService } from '@synergia-frontend/services';
import { formatDateTime } from '@synergia-frontend/utils';
import { openPostDialog } from '../add-post-btn/dialog-add-post/open-post-dialog';
import { colorForId } from '../dialog-card/dialog-card.model';
import { MarkdownComponent } from '../markdown/markdown.component';

/**
 * Feed do evento: postagens em Markdown, da mais nova para a mais antiga, com o autor de cada uma.
 * Quem escreveu pode editar e apagar.
 */
@Component({
  selector: 'lib-event-feed',
  standalone: true,
  imports: [MarkdownComponent, MatIconModule, MatMenuModule, MatTooltipModule],
  template: `
    <ng-content></ng-content>
    @for (post of posts(); track post.id) {
      <article class="post">
        <header class="author">
          <span class="avatar" [style.background]="colorFor(post.idAccount)">{{ initials(post.authorName) }}</span>
          <div class="who">
            <strong>{{ post.authorName }}</strong>
            <small>
              {{ formatDateTime(post.createdAt) }}
              @if (wasEdited(post)) {
                <span [matTooltip]="'Editado em ' + formatDateTime(post.updatedAt)">· editado</span>
              }
            </small>
          </div>
          @if (isMine(post)) {
            <button type="button" class="action" aria-label="Opções da postagem" [matMenuTriggerFor]="postMenu">
              <mat-icon>more_horiz</mat-icon>
            </button>
            <mat-menu #postMenu="matMenu" xPosition="before">
              <button mat-menu-item (click)="edit(post)"><mat-icon>edit</mat-icon> Editar</button>
              <button mat-menu-item (click)="remove(post)"><mat-icon>delete</mat-icon> Apagar</button>
            </mat-menu>
          }
        </header>
        @if (post.title) {
          <h3 class="title">{{ post.title }}</h3>
        }
        @if (post.content.trim()) {
          <lib-markdown [source]="post.content"></lib-markdown>
        }
      </article>
    } @empty {
      @if (loaded()) {
        <span class="empty">Nenhuma postagem ainda. Seja o primeiro a postar.</span>
      }
    }
  `,
  styles: `
    :host { display: flex; flex-direction: column; gap: 12px; }
    .post { display: flex; flex-direction: column; gap: 10px; padding: 14px 16px; border: 1px solid #e8e4dc;
      border-radius: 10px; background: #fff; }
    .author { display: flex; align-items: center; gap: 10px; }
    .avatar { display: inline-flex; align-items: center; justify-content: center; flex: none; width: 34px; height: 34px;
      border-radius: 999px; color: #fff; font-size: 12.5px; font-weight: 700; }
    .who { display: flex; flex-direction: column; min-width: 0; flex: 1; line-height: 1.3; }
    .who strong { font-size: 14px; color: #1b1f3a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .who small { font-size: 12px; color: #9a978f; }
    .title { margin: 0; font-size: 17px; font-weight: 700; color: #121840; overflow-wrap: anywhere; }
    .action { display: inline-flex; border: 0; background: none; color: #8a877f; cursor: pointer; padding: 4px; border-radius: 6px; }
    .action:hover { background: rgba(0, 0, 0, .06); color: #333; }
    .empty { font-size: 0.85rem; color: #888; }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class EventFeedComponent {
  public readonly idEvent = input.required<number>();
  public readonly posts = signal<IPostModel[]>([]);
  public readonly loaded = signal(false);
  public readonly colorFor = colorForId;
  public readonly formatDateTime = formatDateTime;

  private readonly idAccount: number;

  constructor(
    private readonly postService: PostService,
    private readonly snackbar: SnackbarService,
    private readonly dialog: MatDialog,
    sessionService: SessionService
  ) {
    this.idAccount = sessionService.getUserId()!;
    effect(() => this.load(this.idEvent()));
  }

  public isMine(post: IPostModel) {
    return post.idAccount === this.idAccount;
  }

  /** Mais de um minuto entre criar e salvar de novo conta como edição. */
  public wasEdited(post: IPostModel) {
    return new Date(post.updatedAt).getTime() - new Date(post.createdAt).getTime() > 60_000;
  }

  public initials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] ?? '?') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  }

  /** Abre o diálogo de nova postagem; o botão fica no cabeçalho da seção, fora deste componente. */
  public openNew() {
    openPostDialog(this.dialog).subscribe((draft) => {
      if (draft != null) this.create(draft);
    });
  }

  private create(draft: IPostDraft) {
    this.postService.storeOnEvent(this.idEvent(), this.idAccount, draft).subscribe({
      next: () => this.load(this.idEvent()),
      error: (err) => this.snackbar.catchError(err, 'Erro ao publicar a postagem.'),
    });
  }

  public edit(post: IPostModel) {
    openPostDialog(this.dialog, { title: post.title, content: post.content }).subscribe((draft) => {
      if (draft == null) return;
      this.postService.update(post.id, this.idAccount, draft).subscribe({
        next: () => this.load(this.idEvent()),
        error: (err) => this.snackbar.catchError(err, 'Erro ao salvar a postagem.'),
      });
    });
  }

  public remove(post: IPostModel) {
    const label = post.title ? `"${post.title}"` : 'esta postagem';
    if (!confirm(`Apagar ${label}? Não tem como desfazer.`)) return;
    this.postService.delete(post.id, this.idAccount).subscribe({
      next: () => this.posts.update((list) => list.filter((p) => p.id !== post.id)),
      error: (err) => this.snackbar.catchError(err, 'Erro ao apagar a postagem.'),
    });
  }

  private load(idEvent: number) {
    this.postService.listOfEvent(idEvent).subscribe({
      next: (res) => {
        // Se o usuário trocou de evento enquanto carregava, descarta a resposta antiga.
        if (idEvent !== this.idEvent()) return;
        this.posts.set(res);
        this.loaded.set(true);
      },
      error: (err) => this.snackbar.catchError(err, 'Erro ao carregar o feed.'),
    });
  }
}
