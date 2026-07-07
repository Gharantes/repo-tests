import { Component, signal } from "@angular/core";
import { MatRippleModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { RoutingService, SessionService } from "@synergia-frontend/services";
import { EntityEventResourceService, EntityProjectResourceService } from "@synergia-frontend/api";
import { IEventModel, IProjectModel } from "@synergia-frontend/interfaces";
import { EventDtoToModel, ProjectDtoToModel } from "@synergia-frontend/mappers";
import { map, tap } from "rxjs";

@Component({
  selector: 'app-layout-sidebar',
  standalone: true,
  templateUrl: './layout-sidebar.component.html',
  styleUrl: `./layout-sidebar.component.scss`,
  imports: [MatRippleModule, MatIconModule]
})
export class LayoutSidebarComponent {
  public exploreOpen = true;
  public yourProjectsOpen = false;
  public yourEventsOpen = false;
  public administrationOpen = false;

  public readonly projects$ = signal<IProjectModel[]>([]);
  public readonly events$ = signal<IEventModel[]>([]);

  constructor(
    public readonly routingService: RoutingService,
    public readonly sessionService: SessionService,
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

  public getInitials(): string {
    const label = this.sessionService.getUserLabel() ?? '';
    const parts = label.trim().split(/\s+/).filter(p => p.length > 0);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return 'GA';
  }
}
