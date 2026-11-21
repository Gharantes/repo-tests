import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { colorForId } from '../dialog-card/dialog-card.model';
import { SafeImageComponent } from '../safe-image/safe-image.component';
import { IPickEntity } from './dialog-pick-entity.component';

export interface ILinkedEntity extends IPickEntity {
  bannerUrl?: string;
}

/** Grade de projetos/eventos vinculados: capa, título e descrição; clicar abre, "x" tira o vínculo. */
@Component({
  selector: 'lib-entity-link-list',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, SafeImageComponent],
  template: `
    @for (item of items(); track item.id) {
      <article class="item">
        <button type="button" class="open" [matTooltip]="'Abrir ' + item.title" (click)="openItem.emit(item)">
          <span class="cover" [style.background]="bg(item)">
            @if (item.bannerUrl) {
              <lib-safe-image [url]="item.bannerUrl" [altColor]="bg(item)"></lib-safe-image>
            } @else {
              {{ initial(item) }}
            }
          </span>
          <span class="text">
            <strong>{{ item.title }}</strong>
            @if (item.description.trim()) {
              <small>{{ item.description }}</small>
            }
          </span>
        </button>
        @if (canRemove()(item)) {
          <button type="button" class="action" [matTooltip]="removeLabel()" [attr.aria-label]="removeLabel()" (click)="removeItem.emit(item)">
            <mat-icon>close</mat-icon>
          </button>
        }
      </article>
    } @empty {
      @if (loaded()) {
        <span class="empty">{{ emptyText() }}</span>
      }
    }
  `,
  styles: `
    :host { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 10px; }
    .item { display: flex; align-items: center; gap: 4px; padding: 6px 6px 6px 8px; border: 1px solid #e8e4dc;
      border-radius: 10px; background: #fff; min-width: 0; }
    .item:hover { border-color: #cfcbc1; }
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
export class EntityLinkListComponent {
  public readonly items = input.required<ILinkedEntity[]>();
  public readonly loaded = input(false);
  public readonly emptyText = input('');
  public readonly removeLabel = input('Remover');
  public readonly canRemove = input<(item: ILinkedEntity) => boolean>(() => true);
  public readonly openItem = output<ILinkedEntity>();
  public readonly removeItem = output<ILinkedEntity>();

  public bg(item: ILinkedEntity) {
    return item.bannerColor || colorForId(item.id);
  }

  public initial(item: ILinkedEntity) {
    return (item.title?.trim()?.[0] ?? '#').toUpperCase();
  }
}
