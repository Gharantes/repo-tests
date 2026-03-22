import { Component, inject, signal } from '@angular/core';
import { EntityGetByIdResourceService } from '@synergia-frontend/api';
import { IEventModel, IProjectModel } from '@synergia-frontend/interfaces';
import { RoutingService } from '@synergia-frontend/services';
import { map, tap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventDtoToModel, ProjectDtoToModel } from '@synergia-frontend/mappers';
import { SafeImageComponent } from '@synergia-frontend/components';

@Component({
  selector: 'app-project-card-dialog',
  standalone: true,
  templateUrl: './project-card-dialog.component.html',
  styleUrl: 'project-card-dialog.component.scss',
  imports: [SafeImageComponent],
})
export class ProjectCardDialogComponent {
  public readonly projectModel$: IProjectModel = inject(MAT_DIALOG_DATA);
  public readonly project$ = signal<IProjectModel | null>(null);

  constructor(
    private readonly dialog: MatDialogRef<ProjectCardDialogComponent>,
    private readonly entityService: EntityGetByIdResourceService,
    private readonly routingService: RoutingService
  ) {
    this.project$.set(this.projectModel$);
    const idProject = this.projectModel$.id;
    this.entityService
      .getProjectById(idProject)
      .pipe(
        map((res) => ProjectDtoToModel(res)),
        tap((res) => this.project$.set(res))
      )
      .subscribe();
  }

  public editProject() {
    this.routingService.goToEditProject(this.projectModel$.id);
    this.dialog.close(null);
  }
}