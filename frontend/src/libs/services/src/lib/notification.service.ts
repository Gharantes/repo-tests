import { HttpClient } from '@angular/common/http';
import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { BASE_PATH } from '@synergia-frontend/api';
import { INotificationModel } from '@synergia-frontend/interfaces';
import { RoutingService } from './routing.service';
import { SessionService } from './session.service';

/** De quanto em quanto tempo os avisos são relidos do servidor. */
const POLL_MS = 30_000;

/**
 * Avisos da conta (/api/entity-notification). O sino do topo e a seção "Notificações" do dashboard
 * leem estes mesmos signals, então mostram sempre a mesma coisa.
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionService);
  private readonly routing = inject(RoutingService);
  private readonly url = `${inject(BASE_PATH)}/api/entity-notification`;

  public readonly notifications = signal<INotificationModel[]>([]);
  public readonly unread = signal(0);
  /** Os não lidos entre os carregados: é o que o dashboard mostra. */
  public readonly unreadList = computed(() => this.notifications().filter((n) => n.readAt == null));
  public readonly loading = signal(false);
  public readonly loaded = signal(false);

  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stopPolling());
  }

  /** Carrega agora e relê periodicamente. Chamar de novo não cria um segundo timer. */
  public startPolling() {
    this.load();
    if (this.timer != null) return;
    this.timer = setInterval(() => this.load(), POLL_MS);
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
    this.loaded.set(false);
  }

  /** Relê a lista e o contador. */
  public load() {
    const idAccount = this.session.getUserId();
    if (idAccount == null) return;
    const params = { 'id-account': idAccount };
    this.loading.set(true);
    this.http.post<INotificationModel[]>(`${this.url}/list-notifications-of-account`, null, { params }).subscribe({
      next: (list) => {
        this.notifications.set(list);
        this.loading.set(false);
        this.loaded.set(true);
      },
      error: () => {
        this.loading.set(false);
        this.loaded.set(true);
      },
    });
    this.http
      .post<number>(`${this.url}/count-unread`, null, { params })
      .subscribe({ next: (n) => this.unread.set(n), error: () => undefined });
  }

  /** Marca como lida e abre o evento/projeto na aba onde a novidade está. */
  public open(notification: INotificationModel) {
    this.markAsRead(notification);
    const isDate = notification.type === 'DATE';
    if (notification.parentEntity === 'EVENT') {
      this.routing.goToEventDetails(notification.parentId, isDate ? 'calendario' : notification.type === 'POST' ? 'feed' : 'lousa');
    } else {
      this.routing.goToProjectDetails(notification.parentId, isDate ? 'calendario' : 'lousa');
    }
  }

  public markAsRead(notification: INotificationModel) {
    const idAccount = this.session.getUserId();
    if (idAccount == null || notification.readAt != null) return;
    const now = new Date().toISOString();
    this.notifications.update((list) => list.map((n) => (n.id === notification.id ? { ...n, readAt: now } : n)));
    this.unread.update((n) => Math.max(0, n - 1));
    this.http
      .post<void>(`${this.url}/mark-as-read/${notification.id}`, null, { params: { 'id-account': idAccount } })
      .subscribe({ error: () => this.load() });
  }

  public markAllAsRead() {
    const idAccount = this.session.getUserId();
    if (idAccount == null) return;
    const now = new Date().toISOString();
    this.notifications.update((list) => list.map((n) => (n.readAt ? n : { ...n, readAt: now })));
    this.unread.set(0);
    this.http
      .post<void>(`${this.url}/mark-all-as-read`, null, { params: { 'id-account': idAccount } })
      .subscribe({ error: () => this.load() });
  }
}
