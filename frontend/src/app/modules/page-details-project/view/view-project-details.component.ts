import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IProjectModel } from '@synergia-frontend/interfaces';
import {
  colorForId,
  memberInitials,
  memberName,
  ParentNotesComponent,
  ProjectEventsComponent,
  SafeImageComponent,
} from '@synergia-frontend/components';

/** Página do projeto: mesmo layout da tela de criar/editar, só leitura, com atalho para editar. */
@Component({
  selector: 'app-view-project-details',
  templateUrl: './view-project-details.component.html',
  styleUrl: `./view-project-details.component.scss`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ParentNotesComponent, ProjectEventsComponent, SafeImageComponent, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
})
export class ViewProjectDetailsComponent {
  @Input() public project$!: IProjectModel;
  @Output() public readonly goToParentPageEvent = new EventEmitter<void>();
  @Output() public readonly editEvent = new EventEmitter<void>();

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
