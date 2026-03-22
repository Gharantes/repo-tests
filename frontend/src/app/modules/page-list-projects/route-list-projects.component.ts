import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import { catchError, concatMap, debounceTime, map, Observable, of, tap } from 'rxjs';
import { PageListProjectsResourceService } from '@synergia-frontend/api';
import { IProjectModel } from '@synergia-frontend/interfaces';
import { ViewListProjectsComponent } from './view/view-list-projects.component';
import { ConnectorListProjects } from './connector/connector-list-projects';
import { ProjectDtoToModel } from '@synergia-frontend/mappers';
import { MatDialog } from '@angular/material/dialog';
import { ProjectCardDialogComponent } from './dialog-project-card/project-card-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-page-list-projects-route',
  standalone: true,
  templateUrl: './route-list-projects.component.html',
  styleUrl: `./route-list-projects.component.scss`,
  imports: [ViewListProjectsComponent],
  providers: [ConnectorListProjects],
})
export class RouteListProjectsComponent {
  public readonly data$ = signal<IProjectModel[]>([]);
  public readonly connector = inject(ConnectorListProjects);

  constructor(
    private readonly listProjectsService: PageListProjectsResourceService,
    private readonly snackService: SnackbarService,
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService,
    private readonly dialog: MatDialog,
    private readonly destroyRef: DestroyRef
  ) {
    this.getListProjects().subscribe();
    this.watchForm();
  }
  private watchForm() {
    this.connector.form.valueChanges
      .pipe(
        debounceTime(300),
        concatMap(() => this.getListProjects()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public getListProjects(): Observable<unknown> {
    const idTenant = this.sessionService.getTenantId();
    const text = this.connector.form.controls.text.value;
    if (idTenant == null) {
      this.data$.set([]);
      return of([]);
    }
    return this.listProjectsService.listProjects(idTenant, text).pipe(
      catchError((err) => {
        this.snackService.catchError(err);
        return of([]);
      }),
      map((res) => res.map((v) => ProjectDtoToModel(v))),
      tap((res) => this.data$.set(res))
    );
  }

  createProject() {
    this.routingService.goToCreateProject();
  }
  openCard($event: IProjectModel) {
    this.dialog.open(ProjectCardDialogComponent, { data: $event });
  }
}