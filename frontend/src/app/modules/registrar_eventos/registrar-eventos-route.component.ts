import { Component, inject, OnInit, signal } from "@angular/core";
import { AbsClassNonParameterizedRoute } from "@synergia-frontend/abstracts";
import { IDoBasicEventInfo } from "@synergia-frontend/interfaces";
import { RoutingService } from "@synergia-frontend/services";
import { RegistrarEventosViewComponent } from "@synergia-frontend/views";

@Component({
  standalone: true,
  selector: 'app-registrar-eventos-route',
  template: `
    <lib-registrar-eventos-view></lib-registrar-eventos-view>
  `,
  styleUrl: `./style.scss`,
  imports: [RegistrarEventosViewComponent],
})
export class RegistrarEventosRouteComponent
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