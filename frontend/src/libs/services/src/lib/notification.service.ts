import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { BASE_PATH } from '@synergia-frontend/api';
import { IFeedItemModel, INotificationModel } from '@synergia-frontend/interfaces';
import { SessionService } from './session.service';

/** De quanto em quanto tempo o sino confere se chegou aviso novo. */
const POLL_MS = 30_000;

/**
 * Sino do topo (/api/entity-notification) e feed do dashboard (/api/page-dashboard).
 * Guarda os avisos e o número de não lidos em signals, para o topo e o dashboard lerem o mesmo estado.
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionService);
  private readonly basePath = inject(BASE_PATH);
  private readonly url = `${this.basePath}/api/entity-notification`;

  public readonly notifications = signal<INotificationModel[]>([]);
  public readonly unread = signal(0);
  public readonly loading = signal(false);

  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stopPolling());
  }

  /** Começa a conferir o contador periodicamente. Chamar de novo não cria um segundo timer. */
  public startPolling() {
    this.refreshUnread();
    if (this.timer != null) return;
    this.timer = setInterval(() => this.refreshUnread(), POLL_MS);
  }

  public stopPolling() {
    if (this.timer != null) clearInterval(this.timer);
    this.timer = null;
  }

  /** No logout: para o timer e esquece os avisos da conta que saiu. */
  public reset() {
    this.stopPolling();
    this.notifications.set([]);
    this.unread.set(0);
  }

  public refreshUnread() {
    const idAccount = this.session.getUserId();
    if (idAccount == null) return;
    this.http
      .post<number>(`${this.url}/count-unread`, null, { params: { 'id-account': idAccount } })
      .subscribe({ next: (n) => this.unread.set(n), error: () => undefined });
  }

  /** Recarrega a lista (ao abrir o sino). */
  public load() {
    const idAccount = this.session.getUserId();
    if (idAccount == null) return;
    this.loading.set(true);
    this.http
      .post<INotificationModel[]>(`${this.url}/list-notifications-of-account`, null, {
        params: { 'id-account': idAccount },
      })
      .subscribe({
        next: (list) => {
          this.notifications.set(list);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    this.refreshUnread();
  }

  public markAsRead(notification: INotificationModel) {
    const idAccount = this.session.getUserId();
    if (idAccount == null || notification.readAt != null) return;
    const now = new Date().toISOString();
    this.notifications.update((list) => list.map((n) => (n.id === notification.id ? { ...n, readAt: now } : n)));
    this.unread.update((n) => Math.max(0, n - 1));
    this.http
      .post<void>(`${this.url}/mark-as-read/${notification.id}`, null, { params: { 'id-account': idAccount } })
      .subscribe({ error: () => this.refreshUnread() });
  }

  public markAllAsRead() {
    const idAccount = this.session.getUserId();
    if (idAccount == null) return;
    const now = new Date().toISOString();
    this.notifications.update((list) => list.map((n) => (n.readAt ? n : { ...n, readAt: now })));
    this.unread.set(0);
    this.http
      .post<void>(`${this.url}/mark-all-as-read`, null, { params: { 'id-account': idAccount } })
      .subscribe({ error: () => this.refreshUnread() });
  }

  public listFeed(idAccount: number, limit = 20) {
    return this.http.post<IFeedItemModel[]>(`${this.basePath}/api/page-dashboard/list-feed-of-account`, null, {
      params: { 'id-account': idAccount, limit },
    });
  }
}
