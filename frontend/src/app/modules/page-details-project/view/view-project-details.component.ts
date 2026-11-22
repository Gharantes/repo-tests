import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, signal, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IProjectModel } from '@synergia-frontend/interfaces';
import {
  colorForId,
  memberInitials,
  memberName,
  ParentCalendarComponent,
  ParentNotesComponent,
  ProjectEventsComponent,
  SafeImageComponent,
} from '@synergia-frontend/components';
import { ConnectorUpsertProject } from '../../page-upsert-project/connector/connector-upsert-project';
import { EntityCoverFieldComponent } from '../../../shared/entity-fields/entity-cover-field.component';
import { EntityFormFieldsComponent } from '../../../shared/entity-fields/entity-form-fields.component';

/** Página do projeto: leitura por padrão; em modo edição o topo vira os mesmos campos da tela de criar. */
@Component({
  selector: 'app-view-project-details',
  templateUrl: './view-project-details.component.html',
  styleUrl: `./view-project-details.component.scss`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [EntityCoverFieldComponent, EntityFormFieldsComponent, ParentNotesComponent, ParentCalendarComponent, ProjectEventsComponent, SafeImageComponent, MatButtonModule, MatIconModule, MatMenuModule, MatTabsModule, MatTooltipModule],
})
export class ViewProjectDetailsComponent {
  @Input() public project$!: IProjectModel;
  @Input() public editing = false;
  /** Membro, ou quem tem EDIT_*_AS_NON_MEMBER. */
  @Input() public canEdit = false;
  /** Membro, ou quem tem ASSIGN_TAGS_*_AS_NON_MEMBER. */
  @Input() public canEditTags = false;
  /** Só membros marcam datas no calendário. */
  @Input() public isMember = false;
  @Input() public connector!: ConnectorUpsertProject;
  @Output() public readonly goToParentPageEvent = new EventEmitter<void>();
  @Output() public readonly editEvent = new EventEmitter<void>();
  @Output() public readonly cancelEditEvent = new EventEmitter<void>();
  @Output() public readonly saveEvent = new EventEmitter<void>();

  /** Aba aberta: 0 Lousa, 1 Eventos, 2 Calendário. */
  public readonly tab = signal(0);
  // Os "+" ficam fora das abas e chamam o componente da aba aberta.
  public readonly notes = viewChild(ParentNotesComponent);
  public readonly events = viewChild(ProjectEventsComponent);
  public readonly calendar = viewChild(ParentCalendarComponent);

  public readonly colorFor = colorForId;
  public readonly initials = memberInitials;
  public readonly nameOf = memberName;

  public get bannerBg(): string {
    return this.project$.bannerColor || colorForId(this.project$.id);
  }

  public get initial(): string {
    return (this.project$.title?.trim()?.[0] ?? '#').toUpperCase();
  }
}
