import { Component, inject, signal } from '@angular/core';
import { EntityGetByIdResourceService } from '@synergia-frontend/api';
import { IProjectModel } from '@synergia-frontend/interfaces';
import { RoutingService } from '@synergia-frontend/services';
import { map, tap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectDtoToModel } from '@synergia-frontend/mappers';
import { SafeImageComponent } from '../safe-image/safe-image.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-dialog-card-project',
  standalone: true,
  templateUrl: './dialog-card-project.component.html',
  styleUrl: 'dialog-card-project.component.scss',
  imports: [SafeImageComponent, MatButtonModule, MatIconModule],
})
export class DialogCardProjectComponent {
  public readonly projectModel$: IProjectModel = inject(MAT_DIALOG_DATA);
  public readonly project$ = signal<IProjectModel>(this.projectModel$);

  constructor(
    private readonly dialog: MatDialogRef<DialogCardProjectComponent>,
    private readonly entityService: EntityGetByIdResourceService,
    private readonly routingService: RoutingService
  ) {
    this.getById();
  }
  private getById() {
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
  public registerInEvent() {

  }
}