import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { INotificationModel } from '@synergia-frontend/interfaces';
import { activityIcon, activityVerb, formatDateTime, formatRelativeTime } from '@synergia-frontend/utils';

/**
 * Seção "Notificações" do dashboard: os mesmos avisos do sino, só os não lidos.
 * Clicar abre o que foi criado; o check marca como lido e tira da lista.
 */
@Component({
  selector: 'app-dashboard-notifications',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
  template: `
    @if (items().length > 0) {
      <div class="bar">
        <button type="button" class="link" (click)="markAllEvent.emit()">Marcar todas como lidas</button>
      </div>
    }
    @for (n of items(); track n.id) {
      <div class="row">
        <button type="button" class="open" (click)="openEvent.emit(n)">
          <span class="icon" [attr.data-type]="n.type"><mat-icon>{{ iconFor(n.type) }}</mat-icon></span>
          <span class="text">
            <b>{{ n.actorName }}</b> {{ verbFor(n.type) }} <b>{{ n.parentTitle }}</b>@if (n.type === 'DATE' && n.referenceTitle) {: {{ n.referenceTitle }}}
          </span>
          <small [matTooltip]="formatDateTime(n.createdAt)">{{ relative(n.createdAt) }}</small>
        </button>
        <button
          type="button"
          class="read"
          matTooltip="Marcar como lida"
          aria-label="Marcar como lida"
          (click)="markReadEvent.emit(n)"
        >
          <mat-icon>check</mat-icon>
        </button>
      </div>
    } @empty {
      <div class="empty">
        <mat-icon>notifications_none</mat-icon>
        <span>{{ loaded() ? 'Nenhuma notificação nova.' : 'Carregando…' }}</span>
      </div>
    }
  `,
  styles: `
    :host { display: flex; flex-direction: column; gap: 6px; max-width: 760px; }
    .bar { display: flex; justify-content: flex-end; }
    .link { border: 0; background: none; padding: 0; color: #3B52CC; font: inherit; font-size: 0.82rem; cursor: pointer; }
    .link:hover { text-decoration: underline; }
    .row { display: flex; align-items: center; border: 1px solid #e8e4dc; border-radius: 10px; background: #fff;
      transition: border-color .15s; }
    .row:hover { border-color: #c9cff0; }
    .open { flex: 1; min-width: 0; display: flex; align-items: center; gap: 12px; padding: 10px 14px; border: 0;
      background: none; font: inherit; color: inherit; text-align: left; cursor: pointer; border-radius: 10px; }
    .open:focus-visible, .read:focus-visible { outline: 2px solid #3B52CC; outline-offset: 2px; }
    .icon { flex: none; display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px;
      border-radius: 50%; background: #e8ebfb; color: #3B52CC; }
    .icon[data-type='NOTE'] { background: #fff4c2; color: #8a6d00; }
    .icon[data-type='LIST'] { background: #d9f2dc; color: #2e7d32; }
    .icon[data-type='DATE'] { background: #fde4dc; color: #b3471d; }
    .icon mat-icon { font-size: 17px; width: 17px; height: 17px; }
    .text { flex: 1; min-width: 0; font-size: 0.88rem; color: #555; overflow-wrap: anywhere; }
    .text b { color: #121840; font-weight: 600; }
    .open small { flex: none; font-size: 0.75rem; color: #9a978f; }
    .read { flex: none; display: inline-flex; margin-right: 8px; padding: 6px; border: 0; border-radius: 50%;
      background: none; color: #8a877f; cursor: pointer; }
    .read:hover { background: #eef0fb; color: #3B52CC; }
    .read mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .empty { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border: 1px dashed #d8d3c8;
      border-radius: 10px; background: #fff; color: #888; font-size: 0.88rem; }
    .empty mat-icon { flex: none; color: #bbb; }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DashboardNotificationsComponent {
  public readonly items = input<INotificationModel[]>([]);
  public readonly loaded = input(false);
  public readonly openEvent = output<INotificationModel>();
  public readonly markReadEvent = output<INotificationModel>();
  public readonly markAllEvent = output<void>();

  public readonly iconFor = activityIcon;
  public readonly verbFor = activityVerb;
  public readonly formatDateTime = formatDateTime;
  public readonly relative = (value: string) => formatRelativeTime(value);
}
