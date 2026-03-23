import { Component, signal } from '@angular/core';
import { SessionService } from '@synergia-frontend/services';
import { IEventModel, IProjectModel } from '@synergia-frontend/interfaces';
import { ViewDashboardComponent } from './view/view-dashboard.component';
import {
  EntityEventResourceService,
  EntityProjectResourceService,
} from '@synergia-frontend/api';
import { map, tap } from 'rxjs';
import { EventDtoToModel, ProjectDtoToModel } from '@synergia-frontend/mappers';
import { MatDialog } from '@angular/material/dialog';
import {
  DialogCardEventComponent,
  DialogCardProjectComponent,
} from '@synergia-frontend/components';

@Component({
  selector: 'app-dashboard-route',
  standalone: true,
  templateUrl: 'route-dashboard.component.html',
  styleUrl: `route-dashboard.component.scss`,
  imports: [ViewDashboardComponent],
})
export class RouteDashboardComponent {
  public readonly projects$ = signal<IProjectModel[]>([]);
  public readonly events$ = signal<IEventModel[]>([]);

  constructor(
    private readonly sessionService: SessionService,
    private readonly entityProjectService: EntityProjectResourceService,
    private readonly entityEventService: EntityEventResourceService,
    private readonly dialog: MatDialog
  ) {
    this.lookupEvents();
    this.lookupProjects();
  }

  private lookupProjects() {
    const idAccount = this.sessionService.getUserId();
    if (idAccount == null) return;
    this.entityProjectService
      .listProjectsByAccount(idAccount)
      .pipe(
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
        map((res) => res.map((v) => EventDtoToModel(v))),
        tap((res) => this.events$.set(res))
      )
      .subscribe();
  }

  public eventCardInteraction($event: IEventModel) {
    this.dialog
      .open(DialogCardEventComponent, {
        data: $event,
        maxWidth: '100%',
        maxHeight: '100%',
        width: '80%',
        height: '80%'
      })
      .afterClosed()
      .subscribe();
  }
  public projectCardInteraction($event: IProjectModel) {
    this.dialog
      .open(DialogCardProjectComponent, {
        data: $event,
        maxWidth: '100%',
        maxHeight: '100%',
        width: '80%',
        height: '80%'
      })
      .afterClosed()
      .subscribe();
  }
}