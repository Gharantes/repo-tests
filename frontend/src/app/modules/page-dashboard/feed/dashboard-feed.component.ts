import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { colorForId, MarkdownComponent } from '@synergia-frontend/components';
import { IFeedItemModel } from '@synergia-frontend/interfaces';
import { activityIcon, activityName, activityVerb, formatDateTime, formatRelativeTime } from '@synergia-frontend/utils';

/** Quantos itens aparecem antes de "Ver mais". */
const COLLAPSED = 4;
/** Quantos itens de uma lista aparecem no cartão. */
const LIST_PREVIEW = 4;

/**
 * Feed "Novidades" do dashboard: postagens e blocos da lousa dos eventos e projetos do usuário.
 * Clicar num item abre o evento/projeto na aba certa.
 */
@Component({
  selector: 'app-dashboard-feed',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, MarkdownComponent],
  template: `
    @for (item of visible(); track item.type + item.referenceId) {
      <button type="button" class="item" (click)="openEvent.emit(item)">
        <header class="head">
          <span class="avatar" [style.background]="colorFor(item.idAccount)">{{ initials(item.authorName) }}</span>
          <div class="who">
            <span class="line">
              <strong>{{ item.authorName }}</strong>
              @if (item.authorIsLead) {
                <span class="lead">{{ item.parentEntity === 'EVENT' ? 'Organizador' : 'Líder' }}</span>
              }
              <span class="verb">{{ verbFor(item.type) }}</span>
              <span class="parent">
                <mat-icon>{{ item.parentEntity === 'EVENT' ? 'event' : 'folder' }}</mat-icon>{{ item.parentTitle }}
              </span>
            </span>
            <small [matTooltip]="formatDateTime(item.createdAt)">{{ relative(item.createdAt) }}</small>
          </div>
          <span class="kind" [attr.data-type]="item.type" [matTooltip]="nameFor(item.type)">
            <mat-icon>{{ iconFor(item.type) }}</mat-icon>
          </span>
        </header>

        @if (item.title) {
          <h3 class="title">{{ item.title }}</h3>
        }
        @switch (item.type) {
          @case ('POST') {
            @if (item.content.trim()) {
              <div class="preview md"><lib-markdown [source]="item.content"></lib-markdown></div>
            }
          }
          @case ('LIST') {
            <ul class="checklist">
              @for (entry of item.items.slice(0, listPreview); track $index) {
                <li [class.done]="entry.done">
                  <mat-icon>{{ entry.done ? 'check_box' : 'check_box_outline_blank' }}</mat-icon>{{ entry.text }}
                </li>
              }
              @if (item.items.length > listPreview) {
                <li class="more">+ {{ item.items.length - listPreview }} itens</li>
              }
            </ul>
          }
          @default {
            @if (item.content.trim()) {
              <p class="preview text">{{ item.content }}</p>
            }
          }
        }
      </button>
    } @empty {
      @if (loaded()) {
        <div class="empty">
          <mat-icon>dynamic_feed</mat-icon>
          <span>Nada novo por aqui. Postagens, notas e listas dos seus eventos e projetos aparecem neste feed.</span>
        </div>
      } @else {
        <div class="empty">Carregando…</div>
      }
    }
    @if (items().length > collapsedCount) {
      <button type="button" class="toggle" (click)="expanded.set(!expanded())">
        {{ expanded() ? 'Ver menos' : 'Ver mais (' + (items().length - collapsedCount) + ')' }}
        <mat-icon>{{ expanded() ? 'expand_less' : 'expand_more' }}</mat-icon>
      </button>
    }
  `,
  styles: `
    :host { display: flex; flex-direction: column; gap: 10px; max-width: 760px; }
    .item { display: flex; flex-direction: column; gap: 8px; width: 100%; padding: 14px 16px; text-align: left;
      font: inherit; color: inherit; border: 1px solid #e8e4dc; border-radius: 10px; background: #fff; cursor: pointer;
      transition: border-color .15s, box-shadow .15s; }
    .item:hover { border-color: #c9cff0; box-shadow: 0 2px 8px rgba(59, 82, 204, .08); }
    .item:focus-visible { outline: 2px solid #3B52CC; outline-offset: 2px; }
    .head { display: flex; align-items: flex-start; gap: 10px; }
    .avatar { display: inline-flex; align-items: center; justify-content: center; flex: none; width: 34px; height: 34px;
      border-radius: 999px; color: #fff; font-size: 12.5px; font-weight: 700; }
    .who { display: flex; flex-direction: column; flex: 1; min-width: 0; line-height: 1.35; }
    .line { font-size: 0.88rem; color: #555; overflow-wrap: anywhere; }
    .line strong { color: #1b1f3a; }
    .lead { display: inline-block; margin: 0 4px; padding: 0 6px; border-radius: 999px; background: #eef0fb; color: #3B52CC;
      font-size: 0.7rem; font-weight: 600; vertical-align: 1px; }
    .verb { margin: 0 4px; }
    .parent { display: inline-flex; align-items: center; gap: 3px; font-weight: 600; color: #121840; }
    .parent mat-icon { font-size: 15px; width: 15px; height: 15px; color: #8a877f; }
    .who small { font-size: 0.75rem; color: #9a978f; }
    .kind { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px;
      border-radius: 50%; background: #e8ebfb; color: #3B52CC; }
    .kind[data-type='NOTE'] { background: #fff4c2; color: #8a6d00; }
    .kind[data-type='LIST'] { background: #d9f2dc; color: #2e7d32; }
    .kind mat-icon { font-size: 17px; width: 17px; height: 17px; }
    .title { margin: 0; font-size: 1rem; font-weight: 700; color: #121840; overflow-wrap: anywhere; }
    .preview { margin: 0; max-height: 7.5em; overflow: hidden; font-size: 0.88rem; color: #333;
      -webkit-mask-image: linear-gradient(#000 70%, transparent); mask-image: linear-gradient(#000 70%, transparent); }
    .preview.text { white-space: pre-wrap; overflow-wrap: anywhere; }
    .checklist { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 3px; font-size: 0.88rem; }
    .checklist li { display: flex; align-items: center; gap: 6px; color: #333; overflow-wrap: anywhere; }
    .checklist li.done { color: #888; text-decoration: line-through; }
    .checklist mat-icon { flex: none; font-size: 17px; width: 17px; height: 17px; color: #8a877f; }
    .checklist .more { color: #8a877f; font-size: 0.8rem; padding-left: 23px; }
    .empty { display: flex; align-items: center; gap: 10px; padding: 16px; border: 1px dashed #d8d3c8; border-radius: 10px;
      color: #888; font-size: 0.88rem; background: #fff; }
    .empty mat-icon { flex: none; color: #bbb; }
    .toggle { align-self: flex-start; display: inline-flex; align-items: center; gap: 2px; border: 0; background: none;
      padding: 4px 2px; color: #3B52CC; font: inherit; font-size: 0.88rem; font-weight: 500; cursor: pointer; }
    .toggle:hover { text-decoration: underline; }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DashboardFeedComponent {
  public readonly items = input<IFeedItemModel[]>([]);
  public readonly loaded = input(false);
  public readonly openEvent = output<IFeedItemModel>();

  public readonly expanded = signal(false);
  public readonly collapsedCount = COLLAPSED;
  public readonly listPreview = LIST_PREVIEW;
  public readonly visible = computed(() => (this.expanded() ? this.items() : this.items().slice(0, COLLAPSED)));

  public readonly colorFor = colorForId;
  public readonly iconFor = activityIcon;
  public readonly verbFor = activityVerb;
  public readonly nameFor = activityName;
  public readonly formatDateTime = formatDateTime;
  public readonly relative = (value: string) => formatRelativeTime(value);

  public initials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] ?? '?') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  }
}
