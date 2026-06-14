import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntityGetByIdResourceService } from '@synergia-frontend/api';
import { RoutingService } from '@synergia-frontend/services';
import { map, tap } from 'rxjs';
import { ProjectDtoToModel } from '@synergia-frontend/mappers';
import { IProjectModel } from '@synergia-frontend/interfaces';
import { ViewProjectDetailsComponent } from './view/view-project-details.component';

@Component({
  selector: 'app-route-project-details',
  templateUrl: './route-project-details.component.html',
  styleUrl: `./route-project-details.component.scss`,
  imports: [ViewProjectDetailsComponent],
})
export class RouteProjectDetailsComponent {
  private readonly idProject = signal<number | null>(null);
  public readonly project$ = signal<IProjectModel | null>(null);

  constructor(
    private readonly routingService: RoutingService,
    private readonly entityService: EntityGetByIdResourceService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.getFromRouteParams();
  }

  private getFromRouteParams() {
    this.routingService
      .getParamFromRoute(this.activatedRoute, 'id')
      .then((id) => {
        if (id == null) {
          this.routingService.goToListProjects();
          return;
        } else {
          this.idProject.set(Number(id));
          this.lookupProject();
        }
      });
  }

  public lookupProject() {
    const idProject = this.idProject();
    if (idProject == null) return;
    const lookupTags = true;
    const lookupMembers = true

    this.entityService
      .getProjectById(idProject, lookupTags, lookupMembers)
      .pipe(
        map((res) => ProjectDtoToModel(res)),
        tap((res) => this.project$.set(res))
      )
      .subscribe();
  }
}
