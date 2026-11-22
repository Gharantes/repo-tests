import { ChangeDetectionStrategy, Component, computed, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityProjectResourceService } from '@synergia-frontend/api';
import { colorForId, DialogPickEntityComponent, IPickEntity } from '@synergia-frontend/components';
import {
  IConversationMemberModel,
  IConversationModel,
  IMessageContactModel,
  IMessageModel,
} from '@synergia-frontend/interfaces';
import {
  JoinRequestService,
  MessageService,
  ProjectEventsService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import { formatRelativeTime } from '@synergia-frontend/utils';
import { catchError, filter, forkJoin, map, of, switchMap } from 'rxjs';

/** De quanto em quanto tempo a conversa aberta procura mensagens novas. */
const MESSAGES_POLL_MS = 5_000;
/** A lista de conversas é relida a cada tantas rodadas da conversa aberta (~15 s). */
const LIST_EVERY_N_POLLS = 3;
/** O mesmo tamanho de página do servidor: veio cheia, provavelmente há mais para trás. */
const PAGE_SIZE = 50;
const MAX_LENGTH = 4000;

/** Uma linha da conversa: separador de dia ou mensagem. */
type TimelineItem =
  | { kind: 'day'; key: string; label: string }
  | { kind: 'message'; key: string; message: IMessageModel; mine: boolean; showAuthor: boolean };

/**
 * Tela Mensagens: à esquerda as conversas (grupos de projeto, grupos projeto + evento e conversas
 * privadas); no meio a conversa aberta (?c=<id>); à direita, quando aberto, quem participa.
 */
@Component({
  selector: 'app-route-messages',
  templateUrl: './route-messages.component.html',
  // Folhas separadas: cada uma precisa caber no limite de 4 kB por estilo do build de produção.
  styleUrls: ['./route-messages.component.scss', './route-messages.chat.scss', './route-messages.members.scss', './route-messages.join-request.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
})
export class RouteMessagesComponent {
  private readonly messageService = inject(MessageService);
  private readonly joinRequests = inject(JoinRequestService);
  private readonly projectEvents = inject(ProjectEventsService);
  private readonly projectService = inject(EntityProjectResourceService);
  private readonly snackbar = inject(SnackbarService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public readonly idAccount = inject(SessionService).getUserId() ?? -1;
  public readonly colorFor = colorForId;
  public readonly relative = (value: string) => formatRelativeTime(value);
  public readonly maxLength = MAX_LENGTH;

  public readonly conversations = signal<IConversationModel[]>([]);
  public readonly listLoaded = signal(false);
  public readonly search = signal('');
  public readonly selectedId = signal<number | null>(null);
  public readonly messages = signal<IMessageModel[]>([]);
  public readonly members = signal<IConversationMemberModel[]>([]);
  public readonly loadingMessages = signal(false);
  public readonly hasOlder = signal(false);
  public readonly loadingOlder = signal(false);
  public readonly membersOpen = signal(false);
  public readonly draft = signal('');
  public readonly sending = signal(false);

  private readonly scroller = viewChild<ElementRef<HTMLElement>>('scroller');
  private readonly composer = viewChild<ElementRef<HTMLTextAreaElement>>('composer');
  private pollCount = 0;
  /** Muda a cada conversa aberta; respostas que chegam de uma conversa anterior são descartadas. */
  private openToken = 0;

  public readonly filtered = computed(() => {
    const term = normalize(this.search().trim());
    return this.conversations().filter((c) => !term || normalize(this.titleOf(c)).includes(term));
  });

  public readonly selected = computed(() => this.conversations().find((c) => c.id === this.selectedId()) ?? null);

  /** Sou membro do projeto da conversa (posso adicionar/tirar gente do evento). */
  public readonly isProjectMember = computed(() =>
    this.members().some((m) => m.idAccount === this.idAccount && m.origin === 'PROJECT')
  );

  public readonly projectMembers = computed(() => this.members().filter((m) => m.origin !== 'EVENT'));
  public readonly eventMembers = computed(() => this.members().filter((m) => m.origin === 'EVENT'));

  public readonly timeline = computed<TimelineItem[]>(() => {
    const items: TimelineItem[] = [];
    const isGroup = this.selected()?.type !== 'DIRECT';
    let lastDay = '';
    let lastAuthor: number | null = null;
    for (const message of this.messages()) {
      const day = new Date(message.createdAt).toDateString();
      if (day !== lastDay) {
        items.push({ kind: 'day', key: `d-${day}`, label: dayLabel(message.createdAt) });
        lastDay = day;
        lastAuthor = null;
      }
      const mine = message.idAccount === this.idAccount;
      items.push({
        kind: 'message',
        key: `m-${message.id}`,
        message,
        mine,
        showAuthor: isGroup && !mine && lastAuthor !== message.idAccount,
      });
      // A apresentação de um futuro membro é um bloco à parte: a próxima mensagem volta a mostrar o autor.
      lastAuthor = message.joinRequestStatus ? null : message.idAccount;
    }
    return items;
  });

  constructor() {
    this.loadConversations();
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      // ?project=<id> (ex.: aviso de pedido para participar) abre o grupo desse projeto.
      const idProject = Number(params.get('project')) || null;
      if (idProject != null) {
        this.openProjectGroup(idProject);
        return;
      }
      this.open(Number(params.get('c')) || null);
    });

    const timer = setInterval(() => this.poll(), MESSAGES_POLL_MS);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  // ---------------------------------------------------------------- lista

  public select(conversation: IConversationModel) {
    this.router.navigate([], { relativeTo: this.route, queryParams: { c: conversation.id } }).then();
  }

  public close() {
    this.router.navigate([], { relativeTo: this.route, queryParams: {} }).then();
  }

  public titleOf(c: IConversationModel): string {
    switch (c.type) {
      case 'PROJECT':
        return c.projectTitle ?? 'Projeto';
      case 'PROJECT_EVENT':
        return `${c.projectTitle ?? 'Projeto'} + ${c.eventTitle ?? 'Evento'}`;
      case 'DIRECT':
        return c.otherAccountName ?? 'Conversa privada';
    }
  }

  public subtitleOf(c: IConversationModel): string {
    switch (c.type) {
      case 'PROJECT':
        return 'Grupo do projeto';
      case 'PROJECT_EVENT':
        return `Grupo do projeto com o evento ${c.eventTitle ?? ''}`.trim();
      case 'DIRECT':
        return 'Conversa privada';
    }
  }

  public previewOf(c: IConversationModel): string {
    if (c.lastMessageContent == null) return 'Nenhuma mensagem ainda';
    if (c.type === 'DIRECT' || c.lastMessageAuthorName == null) return c.lastMessageContent;
    return `${firstName(c.lastMessageAuthorName)}: ${c.lastMessageContent}`;
  }

  public initials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return (parts[0] ?? '?').substring(0, 2).toUpperCase();
  }

  // ---------------------------------------------------------------- novas conversas

  /** Colegas de projeto e pessoas dos eventos dos seus projetos. */
  public startDirect() {
    const options = this.messageService.listContacts().pipe(map((contacts) => groupContacts(contacts)));
    DialogPickEntityComponent.open(this.dialog, {
      heading: 'Nova conversa privada',
      searchPlaceholder: 'Buscar pessoa',
      emptyText: 'Ninguém por aqui ainda: entre num projeto para conversar com os colegas e com quem organiza os eventos dele.',
      options,
      excludeIds: [],
      pickIcon: 'chat',
    })
      .pipe(
        filter((picked): picked is IPickEntity => picked != null),
        switchMap((picked) => this.messageService.openDirect(picked.id))
      )
      .subscribe({
        next: (id) => this.goTo(id),
        error: (err) => this.snackbar.catchError(err, 'Não foi possível abrir a conversa.'),
      });
  }

  /** Um grupo por projeto + evento em que ele está registrado. */
  public startProjectEvent() {
    const pairs: { idProject: number; idEvent: number }[] = [];
    const options = this.projectService.listProjectsByAccount(this.idAccount).pipe(
      switchMap((projects) =>
        projects.length === 0
          ? of([])
          : forkJoin(
              projects.map((p) =>
                this.projectEvents.listEventsOfProject(p.id).pipe(
                  catchError(() => of([])),
                  map((events) => events.map((e) => ({ project: p, event: e })))
                )
              )
            ).pipe(map((lists) => lists.flat()))
      ),
      map((list) =>
        list.map(({ project, event }): IPickEntity => {
          pairs.push({ idProject: project.id, idEvent: event.id });
          return {
            id: pairs.length - 1,
            title: event.title,
            description: `Projeto ${project.title}`,
            bannerColor: event.bannerColor ?? '',
          };
        })
      )
    );
    DialogPickEntityComponent.open(this.dialog, {
      heading: 'Grupo com um evento',
      searchPlaceholder: 'Buscar evento',
      emptyText: 'Seus projetos ainda não estão registrados em nenhum evento.',
      options,
      excludeIds: [],
      pickIcon: 'forum',
    })
      .pipe(
        filter((picked): picked is IPickEntity => picked != null),
        switchMap((picked) => this.messageService.openProjectEvent(pairs[picked.id].idProject, pairs[picked.id].idEvent))
      )
      .subscribe({
        next: (id) => {
          this.goTo(id);
          this.membersOpen.set(true);
        },
        error: (err) => this.snackbar.catchError(err, 'Não foi possível abrir o grupo.'),
      });
  }

  // ---------------------------------------------------------------- participantes

  public addEventMember() {
    const conversation = this.selected();
    if (conversation?.type !== 'PROJECT_EVENT' || conversation.idEvent == null) return;
    const idEvent = conversation.idEvent;
    const options = this.messageService.listContacts().pipe(
      map((contacts) => groupContacts(contacts.filter((c) => c.relation === 'EVENT' && c.parentId === idEvent)))
    );
    DialogPickEntityComponent.open(this.dialog, {
      heading: `Adicionar pessoa de ${conversation.eventTitle ?? 'evento'}`,
      searchPlaceholder: 'Buscar pessoa do evento',
      emptyText: 'Todas as pessoas do evento já estão no grupo.',
      options,
      excludeIds: this.members().map((m) => m.idAccount),
    })
      .pipe(
        filter((picked): picked is IPickEntity => picked != null),
        switchMap((picked) => this.messageService.addMember(conversation.id, picked.id).pipe(map(() => picked)))
      )
      .subscribe({
        next: (picked) => {
          this.snackbar.showMessage(`${picked.title} agora participa do grupo.`);
          this.loadMembers(conversation.id);
        },
        error: (err) => this.snackbar.catchError(err, 'Não foi possível adicionar.'),
      });
  }

  public removeMember(member: IConversationMemberModel) {
    const conversation = this.selected();
    if (conversation == null) return;
    const leaving = member.idAccount === this.idAccount;
    const question = leaving ? 'Sair deste grupo?' : `Tirar ${member.name} do grupo?`;
    if (!confirm(question)) return;
    this.messageService.removeMember(conversation.id, member.idAccount).subscribe({
      next: () => {
        if (leaving) {
          this.conversations.update((list) => list.filter((c) => c.id !== conversation.id));
          this.close();
          return;
        }
        this.loadMembers(conversation.id);
      },
      error: (err) => this.snackbar.catchError(err, 'Não foi possível tirar do grupo.'),
    });
  }

  // ---------------------------------------------------------------- mensagens

  public onComposerKeydown(event: KeyboardEvent) {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    this.send();
  }

  public send() {
    const conversation = this.selected();
    const content = this.draft().trim();
    if (conversation == null || !content || this.sending()) return;
    this.sending.set(true);
    this.messageService.send(conversation.id, content).subscribe({
      next: (message) => {
        this.sending.set(false);
        this.draft.set('');
        this.merge([message]);
        this.touchConversation(conversation.id, message);
        this.scrollToBottom();
        this.composer()?.nativeElement.focus();
      },
      error: (err) => {
        this.sending.set(false);
        this.snackbar.catchError(err, 'Mensagem não enviada.');
      },
    });
  }

  public loadOlder() {
    const id = this.selectedId();
    const oldest = this.messages()[0];
    if (id == null || oldest == null || this.loadingOlder()) return;
    this.loadingOlder.set(true);
    const el = this.scroller()?.nativeElement;
    const previousHeight = el?.scrollHeight ?? 0;
    this.messageService.listMessages(id, { before: oldest.id }).subscribe({
      next: (older) => {
        this.loadingOlder.set(false);
        if (this.selectedId() !== id) return;
        this.hasOlder.set(older.length >= PAGE_SIZE);
        this.messages.update((list) => [...older, ...list]);
        // Mantém na tela a mesma mensagem que estava antes de crescer para cima.
        setTimeout(() => el && (el.scrollTop += el.scrollHeight - previousHeight));
      },
      error: (err) => {
        this.loadingOlder.set(false);
        this.snackbar.catchError(err, 'Erro ao carregar mensagens anteriores.');
      },
    });
  }

  public timeOf(message: IMessageModel) {
    return new Date(message.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  // ---------------------------------------------------------------- pedidos para participar

  /** Aceita ou recusa pela própria mensagem de apresentação. */
  public answerJoinRequest(message: IMessageModel, action: 'accept' | 'decline') {
    if (message.idJoinRequest == null || message.joinRequestStatus !== 'PENDING') return;
    const status = action === 'accept' ? 'ACCEPTED' : 'DECLINED';
    this.joinRequests.respond(message.idJoinRequest, action).subscribe({
      next: () => {
        this.messages.update((list) => list.map((m) => (m.id === message.id ? { ...m, joinRequestStatus: status } : m)));
        const verb = action === 'accept' ? 'agora participa do projeto' : 'teve o pedido recusado';
        this.snackbar.showMessage(`${message.authorName} ${verb}.`);
        const open = this.selectedId();
        if (action === 'accept' && open !== null) this.loadMembers(open);
      },
      // Ex.: outro membro respondeu antes. Relê para mostrar o estado certo.
      error: (err) => {
        this.snackbar.catchError(err, 'Não foi possível responder ao pedido.');
        this.reloadMessages();
      },
    });
  }

  /** Conversa privada com quem pediu para participar (enquanto o pedido está pendente, são contatos). */
  public replyPrivately(message: IMessageModel) {
    this.messageService.openDirect(message.idAccount).subscribe({
      next: (id) => this.goTo(id),
      error: (err) => this.snackbar.catchError(err, 'Não foi possível abrir a conversa.'),
    });
  }

  // ---------------------------------------------------------------- internos

  private openProjectGroup(idProject: number) {
    this.loadConversations(() => {
      const group = this.conversations().find((c) => c.type === 'PROJECT' && c.idProject === idProject);
      const queryParams = group ? { c: group.id } : {};
      this.router.navigate([], { relativeTo: this.route, queryParams, replaceUrl: true }).then();
    });
  }

  private reloadMessages() {
    const id = this.selectedId();
    if (id != null) this.open(id);
  }

  private goTo(idConversation: number) {
    this.loadConversations(() =>
      this.router.navigate([], { relativeTo: this.route, queryParams: { c: idConversation } }).then()
    );
  }

  private open(id: number | null) {
    const token = ++this.openToken;
    this.selectedId.set(id);
    this.messages.set([]);
    this.members.set([]);
    this.hasOlder.set(false);
    this.draft.set('');
    if (id == null) {
      this.membersOpen.set(false);
      return;
    }
    this.loadingMessages.set(true);
    this.messageService.listMessages(id).subscribe({
      next: (list) => {
        if (token !== this.openToken) return;
        this.loadingMessages.set(false);
        this.messages.set(list);
        this.hasOlder.set(list.length >= PAGE_SIZE);
        this.markAsRead(id);
        this.scrollToBottom();
        setTimeout(() => this.composer()?.nativeElement.focus());
      },
      error: (err) => {
        if (token !== this.openToken) return;
        this.loadingMessages.set(false);
        this.snackbar.catchError(err, 'Erro ao abrir a conversa.');
      },
    });
    this.loadMembers(id);
  }

  private loadMembers(id: number) {
    this.messageService.listMembers(id).subscribe({
      next: (list) => this.selectedId() === id && this.members.set(list),
      error: () => undefined,
    });
  }

  private loadConversations(then?: () => void) {
    this.messageService.listConversations().subscribe({
      next: (list) => {
        // A conversa aberta já está lida, mesmo que o servidor ainda não tenha registrado.
        const open = this.selectedId();
        this.conversations.set(list.map((c) => (c.id === open ? { ...c, unreadCount: 0 } : c)));
        this.listLoaded.set(true);
        then?.();
      },
      error: (err) => {
        this.listLoaded.set(true);
        this.snackbar.catchError(err, 'Erro ao carregar as conversas.');
      },
    });
  }

  private poll() {
    if (document.hidden) return;
    if (++this.pollCount % LIST_EVERY_N_POLLS === 0) this.loadConversations();
    const id = this.selectedId();
    if (id == null || this.loadingMessages()) return;
    const last = this.messages().at(-1);
    const token = this.openToken;
    this.messageService.listMessages(id, last ? { after: last.id } : {}).subscribe({
      next: (fresh) => {
        if (token !== this.openToken || fresh.length === 0) return;
        const nearBottom = this.isNearBottom();
        this.merge(fresh);
        this.touchConversation(id, fresh[fresh.length - 1]);
        this.markAsRead(id);
        if (nearBottom) this.scrollToBottom();
      },
      error: () => undefined,
    });
  }

  /** Junta sem repetir: a mensagem enviada pode voltar também na releitura. */
  private merge(incoming: IMessageModel[]) {
    this.messages.update((list) => {
      const known = new Set(list.map((m) => m.id));
      return [...list, ...incoming.filter((m) => !known.has(m.id))].sort((a, b) => a.id - b.id);
    });
  }

  /** Atualiza a prévia da conversa e a leva para o topo da lista. */
  private touchConversation(id: number, message: IMessageModel) {
    this.conversations.update((list) => {
      const current = list.find((c) => c.id === id);
      if (current == null) return list;
      const updated: IConversationModel = {
        ...current,
        lastMessageContent: message.content,
        lastMessageAuthorName: message.authorName,
        lastMessageAt: message.createdAt,
        unreadCount: 0,
      };
      return [updated, ...list.filter((c) => c.id !== id)];
    });
  }

  private markAsRead(id: number) {
    this.conversations.update((list) => list.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)));
    this.messageService.markAsRead(id).subscribe({
      next: () => this.messageService.loadUnread(),
      error: () => undefined,
    });
  }

  private isNearBottom(): boolean {
    const el = this.scroller()?.nativeElement;
    return el == null || el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }

  private scrollToBottom() {
    setTimeout(() => {
      const el = this.scroller()?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }
}

/** Uma linha por pessoa, com os projetos/eventos em comum na descrição. */
function groupContacts(contacts: IMessageContactModel[]): IPickEntity[] {
  const byAccount = new Map<number, { name: string; contexts: string[] }>();
  for (const c of contacts) {
    const entry = byAccount.get(c.idAccount) ?? { name: c.name, contexts: [] };
    const label = c.membershipLabel ? `${c.parentTitle} (${c.membershipLabel})` : c.parentTitle;
    if (!entry.contexts.includes(label)) entry.contexts.push(label);
    byAccount.set(c.idAccount, entry);
  }
  return [...byAccount.entries()].map(([id, { name, contexts }]) => ({
    id,
    title: name,
    description: contexts.join(' · '),
    bannerColor: '',
  }));
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

function dayLabel(value: string): string {
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Hoje';
  if (date.toDateString() === yesterday.toDateString()) return 'Ontem';
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function normalize(s: string) {
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}
