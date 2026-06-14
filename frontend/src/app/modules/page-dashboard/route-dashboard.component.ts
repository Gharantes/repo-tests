import { Component } from '@angular/core';
import { RoutingService } from '@synergia-frontend/services';
import { ViewDashboardComponent } from './view/view-dashboard.component';

@Component({
  selector: 'app-dashboard-route',
  standalone: true,
  templateUrl: 'route-dashboard.component.html',
  styleUrl: `route-dashboard.component.scss`,
  imports: [ViewDashboardComponent],
})
export class RouteDashboardComponent {
  constructor(private readonly routingService: RoutingService) {}

  public goToCreateProject() {
    this.routingService.goToCreateProject();
  }
  public goToCreateEvent() {
    this.routingService.goToCreateEvent();
  }
}
