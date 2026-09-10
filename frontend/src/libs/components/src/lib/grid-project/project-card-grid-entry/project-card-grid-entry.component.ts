import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

import { IProjectModel } from '@synergia-frontend/interfaces';
import { SafeImageComponent } from '../../safe-image/safe-image.component';

@Component({
  selector: 'lib-project-card-grid-entry',
  templateUrl: `project-card-grid-entry.component.html`,
  styleUrl: 'project-card-grid-entry.component.scss',
  imports: [SafeImageComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class ProjectCardGridEntryComponent {
  @Input() public entry!: IProjectModel;
  @Output() public cardInteractionEvent = new EventEmitter<IProjectModel>();
}