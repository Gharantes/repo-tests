import { Component, signal } from '@angular/core';
import { RoutingService, SessionService } from '@synergia-frontend/services';
import { IEventModel, IProjectModel } from '@synergia-frontend/interfaces';

@Component({
  selector: 'app-dashboard-route',
  standalone: true,
  templateUrl: 'route-dashboard.component.html',
  styleUrl: `route-dashboard.component.scss`,
  imports: [],
})
export class RouteDashboardComponent {
  public readonly projects$ = signal<IProjectModel[]>([]);
  public readonly events$ = signal<IEventModel[]>([]);

  constructor(
    private readonly sessionService: SessionService,
    // private readonly pageDashboardService: PageDashboard,
    private readonly routingService: RoutingService
  ) {}
}