import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IProjectModel } from '@synergia-frontend/interfaces';
import { ConnectorListProjects } from '../connector/connector-list-projects';
import { FormListProjectsComponent } from '../form/form-list-projects.component';
import { ProjectCardGridComponent } from '@synergia-frontend/components';

@Component({
  selector: 'app-view-list-projects',
  standalone: true,
  templateUrl: './view-list-projects.component.html',
  styleUrl: 'view-list-projects.component.scss',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    ProjectCardGridComponent,
    FormListProjectsComponent,
    ProjectCardGridComponent,
  ],
})
export class ViewListProjectsComponent {
  @Input() data$!: IProjectModel[];
  @Input() connector!: ConnectorListProjects;

  @Output() readonly openCardEvent = new EventEmitter<IProjectModel>();
  @Output() readonly createProjectEvent = new EventEmitter<void>();
}
