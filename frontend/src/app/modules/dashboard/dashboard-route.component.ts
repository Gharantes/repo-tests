import { Component, inject, OnInit } from "@angular/core";
import { AbsBaseRoute } from "@synergia-frontend/abstracts";
import { RoutingService, SessionService } from "@synergia-frontend/services";
import { of } from "rxjs";

@Component({
  selector: 'app-dashboard-route',
  standalone: true,
  template: `
    <div class="row">
      <div class="col">
        <b>Meus Projetos:</b>
        <b>Meus Eventos:</b>
      </div>
      <div class="col">
        <div>Prazo:</div>
      </div>
    </div>
  `,
  styleUrl: `./style.scss`,
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