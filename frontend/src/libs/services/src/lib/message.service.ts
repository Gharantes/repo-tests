import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { BASE_PATH } from '@synergia-frontend/api';
import {
  IConversationMemberModel,
  IConversationModel,
  IMessageContactModel,
  IMessageModel,
} from '@synergia-frontend/interfaces';
import { SessionService } from './session.service';

/** De quanto em quanto tempo o contador de não lidas da sidebar é relido. */
const UNREAD_POLL_MS = 30_000;

/**
 * Chamadas de /api/entity-message (tela Mensagens). Não há tempo real: a tela relê as mensagens
 * novas da conversa aberta, e a sidebar relê o total de não lidas de tempos em tempos.
 */
@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionService);
  private readonly url = `${inject(BASE_PATH)}/api/entity-message`;

  /** Total de mensagens não lidas, mostrado na sidebar. */
  public readonly unread = signal(0);
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stopPolling());
  }

  private get idAccount(): number {
    return this.session.getUserId() ?? -1;
  }

  public startPolling() {
    this.loadUnread();
    if (this.timer != null) return;
    this.timer = setInterval(() => this.loadUnread(), UNREAD_POLL_MS);
  }

  public stopPolling() {
    if (this.timer != null) clearInterval(this.timer);
    this.timer = null;
  }

  /** No logout: para o timer e zera o contador da conta que saiu. */
  public reset() {
    this.stopPolling();
    this.unread.set(0);
  }

  public loadUnread() {
    if (this.session.getUserId() == null) return;
    this.http
      .post<number>(`${this.url}/count-unread`, null, { params: { 'id-account': this.idAccount } })
      .subscribe({ next: (n) => this.unread.set(n), error: () => undefined });
  }

  public listConversations() {
    return this.http.post<IConversationModel[]>(`${this.url}/list-conversations`, null, {
      params: { 'id-account': this.idAccount },
    });
  }
  public listContacts() {
    return this.http.post<IMessageContactModel[]>(`${this.url}/list-contacts`, null, {
      params: { 'id-account': this.idAccount },
    });
  }
  public listMembers(idConversation: number) {
    return this.http.post<IConversationMemberModel[]>(`${this.url}/list-members/${idConversation}`, null, {
      params: { 'id-account': this.idAccount },
    });
  }
  /** Sem `after`/`before`, as mais recentes. `after`: só as novas. `before`: as anteriores. */
  public listMessages(idConversation: number, options: { after?: number; before?: number } = {}) {
    const params: Record<string, number> = { 'id-account': this.idAccount };
    if (options.after != null) params['after-id'] = options.after;
    if (options.before != null) params['before-id'] = options.before;
    return this.http.post<IMessageModel[]>(`${this.url}/list-messages/${idConversation}`, null, { params });
  }
  public send(idConversation: number, content: string) {
    return this.http.post<IMessageModel>(`${this.url}/send/${idConversation}`, { idAccount: this.idAccount, content });
  }
  public markAsRead(idConversation: number) {
    return this.http.post<void>(`${this.url}/mark-as-read/${idConversation}`, null, {
      params: { 'id-account': this.idAccount },
    });
  }
  public openDirect(idOther: number) {
    return this.http.post<number>(`${this.url}/open-direct`, null, {
      params: { 'id-account': this.idAccount, 'id-other': idOther },
    });
  }
  public openProjectEvent(idProject: number, idEvent: number) {
    return this.http.post<number>(`${this.url}/open-project-event`, null, {
      params: { 'id-account': this.idAccount, 'id-project': idProject, 'id-event': idEvent },
    });
  }
  public addMember(idConversation: number, idMember: number) {
    return this.http.post<void>(`${this.url}/add-member/${idConversation}`, null, {
      params: { 'id-account': this.idAccount, 'id-member': idMember },
    });
  }
  public removeMember(idConversation: number, idMember: number) {
    return this.http.post<void>(`${this.url}/remove-member/${idConversation}`, null, {
      params: { 'id-account': this.idAccount, 'id-member': idMember },
    });
  }
}
