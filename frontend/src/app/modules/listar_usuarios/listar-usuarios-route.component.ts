import { Component, inject, OnInit } from "@angular/core";
import { AbsClassNonParameterizedRoute } from "@synergia-frontend/abstracts";
import { RoutingService } from "@synergia-frontend/services";
import { ListarUsuariosViewComponent } from '@synergia-frontend/views';
import { of } from "rxjs";

@Component({
  standalone: true,
  selector: 'app-listar-usuarios-route',
  template: `
    <lib-listar-usuarios-view
      [data$]="data$"
    ></lib-listar-usuarios-view>
  `,
  styleUrl: `./style.scss`,
  imports: [ListarUsuariosViewComponent],
})
export class ListarUsuariosRouteComponent
implements AbsClassNonParameterizedRoute, OnInit {
  public readonly data$ = of(['teste', 'abc']);

  private readonly routingService = inject(RoutingService);
  
  public ngOnInit(): void {
      this.setRouteInfo();
  }
  public setRouteInfo(): void {
    this.routingService.setRouteInfo(this.routingService.users());
  }
}