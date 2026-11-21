import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable, map } from 'rxjs';
import { EntityGetByIdResourceService } from '@synergia-frontend/api';
import { EventDtoToModel, ProjectDtoToModel } from '@synergia-frontend/mappers';
import { RoutingService } from '@synergia-frontend/services';
import { SafeImageComponent } from '../safe-image/safe-image.component';
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

  /** Começa com o que veio da listagem e é substituído pela versão completa do backend. */
  private readonly entity$ = signal<DialogCardEntity>(this.data.entity);
  public readonly view$ = computed(() => buildDialogCardView(this.data.type, this.entity$()));

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
    this.fetchDetails().subscribe((entity) => this.entity$.set(entity));
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
        if (isProject) this.routingService.goToEditProject(id);
        else this.routingService.goToEditEvent(id);
        break;
      case 'register':
        // TODO: fluxo de "registrar em evento" / "registrar projeto" ainda não existe (já era vazio nos cards antigos).
        return;
      case 'close':
        break;
    }
    this.dialogRef.close(null);
  }
}
