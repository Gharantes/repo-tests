import { Component, inject, OnInit } from "@angular/core";
import { AbsClassNonParameterizedRoute } from "@synergia-frontend/abstracts";
import { RoutingService } from "@synergia-frontend/services";
import { of } from "rxjs";

@Component({
    selector: 'app-dashboard-route',
    template: `
    Teste
  `,
    styleUrl: `./style.scss`,
    imports: []
})
export class DashboardRouteComponent 
implements AbsClassNonParameterizedRoute, OnInit {
  public readonly data$ = of(['teste', 'abc']);

  private readonly routingService = inject(RoutingService);

  public ngOnInit(): void {
      this.setRouteInfo();
  }
  public setRouteInfo(): void {
      this.routingService.setRouteInfo(this.routingService.dashboard());
  }
}