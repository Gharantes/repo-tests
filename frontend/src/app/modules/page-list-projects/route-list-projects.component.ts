import { Component, signal } from '@angular/core';
import {
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import { catchError, concatMap, EMPTY, map, Observable, of, tap } from 'rxjs';
import {
  PageListProjectsResourceService,
  ProjectDto,
} from '@synergia-frontend/api';
import { IProjectModel } from '@synergia-frontend/interfaces';
import { ViewListProjectsComponent } from './view/view-list-projects.component';

@Component({
  selector: 'app-page-list-projects-route',
  standalone: true,
  templateUrl: './route-list-projects.component.html',
  styleUrl: `./route-list-projects.component.scss`,
  imports: [ViewListProjectsComponent],
})
export class RouteListProjectsComponent {
  public readonly data$ = signal<IProjectModel[]>([]);

  constructor(
    private readonly listProjectsService: PageListProjectsResourceService,
    private readonly snackService: SnackbarService,
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService
  ) {
    this.getListProjects().subscribe();
  }

  public getListProjects(): Observable<unknown> {
    const idTenant = this.sessionService.getTenantId();
    if (idTenant == null) {
      this.data$.set([]);
      return of([]);
    }
    return this.listProjectsService.listProjects(idTenant).pipe(
      catchError((err) => {
        this.snackService.catchError(err);
        return of([]);
      }),
      map<ProjectDto[], IProjectModel[]>((res) => {
        return res.map((v) => ({
          id: v.id,
          title: v.title,
          description: v.description,
        }));
      }),
      tap((res) => this.data$.set(res))
    );
  }
  public deleteEntry(el: IProjectModel) {
    this.listProjectsService
      .deleteProject(el.id)
      .pipe(
        catchError(() => {
          this.snackService.showMessage('Erro ao deletar projeto.');
          return EMPTY;
        }),
        concatMap(() => this.getListProjects()),
        tap(() =>
          this.snackService.showMessage('Projeto deletado com sucesso.')
        )
      )
      .subscribe();
  }

  createProject() {
    this.routingService.goToCreateProject()
  }
  updateProject($event: IProjectModel) {
    this.routingService.goToEditProject($event.id);
  }
  toProjectPage($event: IProjectModel) {
    // this.routingService.goToP($event.id)
  }
}