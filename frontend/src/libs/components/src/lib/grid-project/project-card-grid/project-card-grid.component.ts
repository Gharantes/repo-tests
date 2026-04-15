import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProjectModel } from '@synergia-frontend/interfaces';
import { ProjectCardGridEntryComponent } from '../project-card-grid-entry/project-card-grid-entry.component';

@Component({
  selector: 'lib-project-card-grid',
  templateUrl: `project-card-grid.component.html`,
  styleUrl: 'project-card-grid.component.scss',
  imports: [CommonModule, ProjectCardGridEntryComponent],
  standalone: true,
})
export class ProjectCardGridComponent {
  @Input() public data$: IProjectModel[] = [];
  @Output() cardInteractionEvent = new EventEmitter<IProjectModel>();
}