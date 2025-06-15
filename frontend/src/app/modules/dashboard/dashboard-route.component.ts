import { Component, inject, OnInit } from "@angular/core";
import { AbsBaseRoute } from "@synergia-frontend/abstracts";
import { RoutingService, SessionService } from "@synergia-frontend/services";
import { of } from "rxjs";

@Component({
  selector: 'app-dashboard-route',
  standalone: true,
  templateUrl: 'index.html',
  styleUrl: `style.scss`,
  imports: []
})
export class DashboardRouteComponent 
implements AbsBaseRoute, OnInit {
  public readonly data$ = of(['teste', 'abc']);

  constructor (
    private readonly SessionService: SessionService
  ) {}

  private readonly routingService = inject(RoutingService);

  public ngOnInit(): void {
      this.setRouteInfo();
  }
  public setRouteInfo(): void {
      this.routingService.setRouteInfo(this.routingService.dashboard());
  }
}