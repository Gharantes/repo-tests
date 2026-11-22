import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, map } from 'rxjs';
import { EntityGetByIdResourceService } from '@synergia-frontend/api';
import { EventDtoToModel, ProjectDtoToModel } from '@synergia-frontend/mappers';
import { JoinRequestService, PermissionService, RoutingService, SessionService, SnackbarService } from '@synergia-frontend/services';
import { SafeImageComponent } from '../safe-image/safe-image.component';
import { DialogJoinRequestComponent } from './dialog-join-request.component';
import {
  buildDialogCardView,
  colorForId,
  DialogCardAction,
  DialogCardData,
  DialogCardEntity,
  memberInitials,
  memberName,
} from './dialog-card.model';

/**
 * Card de detalhes de projeto ou evento, aberto a partir das listagens.
 * `data.type` decide textos, ações e qual endpoint completa os dados (tags e membros).
 * Layout: capa de altura total à esquerda com título sobreposto; leitura e ações à direita.
 */
@Component({
  selector: 'lib-dialog-card',
  standalone: true,
  templateUrl: './dialog-card.component.html',
  styleUrl: './dialog-card.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatButtonModule, MatIconModule, SafeImageComponent],
})
export class DialogCardComponent {
  private readonly data: DialogCardData = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<DialogCardComponent>);
  private readonly entityService = inject(EntityGetByIdResourceService);
  private readonly routingService = inject(RoutingService);
  private readonly permissions = inject(PermissionService);
  private readonly session = inject(SessionService);
  private readonly joinRequests = inject(JoinRequestService);
  private readonly snackbar = inject(SnackbarService);
  private readonly dialog = inject(MatDialog);

  /** Começa com o que veio da listagem e é substituído pela versão completa do backend. */
  private readonly entity$ = signal<DialogCardEntity>(this.data.entity);
  public readonly view$ = computed(() => buildDialogCardView(this.data.type, this.entity$()));
  /** Os membros só chegam com a versão completa; até lá o botão fica escondido para quem não tem a permissão. */
  public readonly canEdit$ = computed(() =>
    this.data.type === 'project'
      ? this.permissions.canEditProject(this.entity$())
      : this.permissions.canEditEvent(this.entity$())
  );

  /** Só depois que os membros chegam dá para saber se quem vê já participa. */
  private readonly detailsLoaded$ = signal(false);
  /** Projeto de que a conta não participa: pode pedir para entrar. */
  public readonly canRequestJoin$ = computed(() => {
    const idAccount = this.session.getUserId();
    return (
      this.data.type === 'project' &&
      this.detailsLoaded$() &&
      idAccount != null &&
      !this.entity$().members.some((m) => m.id === idAccount)
    );
  });
  /** checking: ainda lendo se já existe pedido; sending: pedido indo para o servidor. */
  public readonly joinState$ = signal<'checking' | 'idle' | 'sending' | 'pending'>('checking');

  public readonly colorFor = colorForId;
  public readonly initials = memberInitials;
  public readonly nameOf = memberName;

  /** Abre o card com a configuração padrão. Use este em vez de `dialog.open` direto. */
  public static open(dialog: MatDialog, data: DialogCardData): MatDialogRef<DialogCardComponent> {
    return dialog.open(DialogCardComponent, {
      data,
      panelClass: 'lib-dialog-card-panel',
      maxWidth: '94vw',
      maxHeight: '90vh',
      autoFocus: 'dialog',
      ariaLabelledBy: 'dialog-card-title',
    });
  }

  constructor() {
    this.fetchDetails().subscribe((entity) => {
      this.entity$.set(entity);
      this.detailsLoaded$.set(true);
    });
    if (this.data.type === 'project') {
      this.joinRequests.hasPendingRequest(this.data.entity.id).subscribe({
        next: (pending) => this.joinState$.set(pending ? 'pending' : 'idle'),
        error: () => this.joinState$.set('idle'),
      });
    }
  }

  /** Pede uma apresentação; ela vai para o grupo do projeto em Mensagens junto com o pedido. */
  public requestJoin() {
    if (this.joinState$() !== 'idle') return;
    DialogJoinRequestComponent.open(this.dialog, { projectTitle: this.entity$().title }).subscribe((message) => {
      if (!message) return;
      this.joinState$.set('sending');
      this.joinRequests.request(this.data.entity.id, message).subscribe({
        next: () => this.joinState$.set('pending'),
        error: (err) => {
          this.joinState$.set('idle');
          this.snackbar.catchError(err, 'Não foi possível enviar o pedido.');
        },
      });
    });
  }

  public cancelJoin() {
    this.joinState$.set('sending');
    this.joinRequests.cancel(this.data.entity.id).subscribe({
      next: () => this.joinState$.set('idle'),
      error: (err) => {
        this.joinState$.set('pending');
        this.snackbar.catchError(err, 'Não foi possível cancelar o pedido.');
      },
    });
  }

  private fetchDetails(): Observable<DialogCardEntity> {
    const id = this.data.entity.id;
    const lookupTags = true;
    const lookupMembers = true;
    return this.data.type === 'project'
      ? this.entityService.getProjectById(id, lookupTags, lookupMembers).pipe(map((res) => ProjectDtoToModel(res)))
      : this.entityService.getEventById(id, lookupTags, lookupMembers).pipe(map((res) => EventDtoToModel(res)));
  }

  public onAction(action: DialogCardAction) {
    const id = this.data.entity.id;
    const isProject = this.data.type === 'project';
    switch (action) {
      case 'open':
        if (isProject) this.routingService.goToProjectDetails(id);
        else this.routingService.goToEventDetails(id);
        break;
      case 'edit':
        if (!this.canEdit$()) break;
        if (isProject) this.routingService.goToEditProject(id);
        else this.routingService.goToEditEvent(id);
        break;
      case 'close':
        break;
    }
    this.dialogRef.close(null);
  }
}
