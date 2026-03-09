import { Component, OnInit, signal } from '@angular/core';
import {
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import { catchError, concatMap, EMPTY, map, tap } from 'rxjs';
import { IProject } from '../../../libs/interfaces/src/lib/entities/i-project';
import { PageListProjectsResourceService } from '@synergia-frontend/api';

@Component({
  selector: 'app-page-list-projects-route',
  standalone: true,
  templateUrl: './route-list-projects.component.html',
  styleUrl: `./route-list-projects.component.scss`,
  imports: [],
})
export class RouteListProjectsComponent {
  constructor(
    private readonly listProjectsService: PageListProjectsResourceService,
    private readonly snackService: SnackbarService,
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService,
  ) {}

  public deleteEntry(el: IProject) {
    this.listProjectsService
      .deleteProject(el.id)
      .pipe(
        catchError(() => {
          this.snackService.showMessage('Erro ao deletar projeto.');
          return EMPTY;
        }),
        concatMap(() => this.getData()),
        tap(() => this.snackService.showMessage('Projeto deletado com sucesso.'))
      )
      .subscribe();
  }

  editEntry($event: IProject) {
    this.routingService.goTo(this.routingService.goToEditProject($event.id));
  }
  toProjectPage($event: IDoBasicProjectInfo) {
    this.routingService.goTo(this.routingService.projectPage($event.id));
  }
}