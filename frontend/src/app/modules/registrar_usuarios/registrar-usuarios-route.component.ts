import { Component, inject, OnInit, signal } from "@angular/core";
import { AbsClassNonParameterizedRoute } from "@synergia-frontend/abstracts";
import { IDoBasicEventInfo } from "@synergia-frontend/interfaces";
import { RoutingService } from "@synergia-frontend/services";

@Component({
  standalone: true,
  selector: 'app-registrar-usuarios-route',
  template: `
  `,
  styleUrl: `./style.scss`,
})
export class RegistrarUsuariosRouteComponent
implements AbsClassNonParameterizedRoute, OnInit {
  public readonly data$ = signal<IDoBasicEventInfo[]>([]);

  private readonly routingService = inject(RoutingService);
  
  public ngOnInit() {
    this.setRouteInfo();
  }

  public setRouteInfo() {
    this.routingService.setRouteInfo(this.routingService.newEvents());
  }
}