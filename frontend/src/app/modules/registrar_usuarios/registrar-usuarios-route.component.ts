import { Component, inject, OnInit, signal } from "@angular/core";
import { AbsClassNonParameterizedRoute } from "@synergia-frontend/abstracts";
import { IDoBasicEventInfo } from "@synergia-frontend/interfaces";
import { RoutingService } from "@synergia-frontend/services";
import { RegistrarUsuariosViewComponent } from "@synergia-frontend/views";

@Component({
  standalone: true,
  selector: 'app-registrar-usuarios-route',
  template: `
    <lib-registrar-usuarios-view
      (goToLastPageEvent)="goToLastPage()"
    ></lib-registrar-usuarios-view>
  `,
  styleUrl: `./style.scss`,
  imports: [RegistrarUsuariosViewComponent],
})
export class RegistrarUsuariosRouteComponent
implements AbsClassNonParameterizedRoute, OnInit {
  public readonly data$ = signal<IDoBasicEventInfo[]>([]);

  private readonly routingService = inject(RoutingService);
  
  public ngOnInit() {
    this.setRouteInfo();
  }
  public setRouteInfo() {
    this.routingService.setRouteInfo(this.routingService.newUsers());
  }
  public goToLastPage() {
    this.routingService.goTo(this.routingService.newUsers());
  }
}