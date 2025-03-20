import { Component, inject, OnInit } from "@angular/core";
import { of } from "rxjs";
import { AbsClassNonParameterizedRoute } from "src/app/abstracts/abs-class-non-parameterized-route";
import { RoutingService } from "src/app/services/routing.service";

@Component({
  standalone: true,
  selector: 'app-dashboard-route',
  template: `
    Teste
  `,
  styleUrl: `./style.scss`,
  imports: [],
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