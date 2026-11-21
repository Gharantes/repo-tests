import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IEventModel } from '@synergia-frontend/interfaces';
import {
  colorForId,
  EventFeedComponent,
  EventProjectsComponent,
  memberInitials,
  memberName,
  ParentNotesComponent,
  SafeImageComponent,
} from '@synergia-frontend/components';

/** Página do evento: mesmo layout da tela de criar/editar, só leitura, com atalho para editar. */
@Component({
  selector: 'app-view-event-details',
  templateUrl: './view-event-details.component.html',
  styleUrl: `./view-event-details.component.scss`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ParentNotesComponent, SafeImageComponent, EventFeedComponent, EventProjectsComponent, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
})
export class ViewEventDetailsComponent {
  @Input() public event$!: IEventModel;
  @Output() public readonly goToParentPageEvent = new EventEmitter<void>();
  @Output() public readonly editEvent = new EventEmitter<void>();

  public readonly colorFor = colorForId;
  public readonly initials = memberInitials;
  public readonly nameOf = memberName;

  public get bannerBg(): string {
    return this.event$.bannerColor || colorForId(this.event$.id);
  }

  public get initial(): string {
    return (this.event$.title?.trim()?.[0] ?? '#').toUpperCase();
  }
}
