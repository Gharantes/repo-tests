import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RoutingService, SessionService, SnackbarService } from '@synergia-frontend/services';
import { EntityEventResourceService, EntityProjectResourceService } from '@synergia-frontend/api';
import { IEventModel, IProjectModel } from '@synergia-frontend/interfaces';
import { EventDtoToModel, ProjectDtoToModel } from '@synergia-frontend/mappers';
import { catchError, map, of, tap } from 'rxjs';
import { ViewDashboardComponent } from './view/view-dashboard.component';

@Component({
  selector: 'app-dashboard-route',
  standalone: true,
  templateUrl: 'route-dashboard.component.html',
  styleUrl: `route-dashboard.component.scss`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ViewDashboardComponent],
})
export class RouteDashboardComponent {
  public readonly projects$ = signal<IProjectModel[]>([]);
  public readonly events$ = signal<IEventModel[]>([]);

  constructor(
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService,
    private readonly snackService: SnackbarService,
    private readonly entityProjectService: EntityProjectResourceService,
    private readonly entityEventService: EntityEventResourceService,
  ) {
    this.lookupProjects();
    this.lookupEvents();
  }

  private lookupProjects() {
    const idAccount = this.sessionService.getUserId();
    if (idAccount == null) return;
    this.entityProjectService
      .listProjectsByAccount(idAccount)
      .pipe(
        catchError((err) => {
          this.snackService.catchError(err);
          return of([]);
        }),
        map((res) => res.map((v) => ProjectDtoToModel(v))),
        tap((res) => this.projects$.set(res))
      )
      .subscribe();
  }

  private lookupEvents() {
    const idAccount = this.sessionService.getUserId();
    if (idAccount == null) return;
    this.entityEventService
      .listEventsByAccount(idAccount)
      .pipe(
        catchError((err) => {
          this.snackService.catchError(err);
          return of([]);
        }),
        map((res) => res.map((v) => EventDtoToModel(v))),
        tap((res) => this.events$.set(res))
      )
      .subscribe();
  }

  public goToCreateProject() {
    this.routingService.goToCreateProject();
  }
  public goToCreateEvent() {
    this.routingService.goToCreateEvent();
  }
  public openProject(project: IProjectModel) {
    this.routingService.goToProjectDetails(project.id);
  }
  public openEvent(event: IEventModel) {
    this.routingService.goToEventDetails(event.id);
  }
}
