import { Component, inject, OnInit, signal } from "@angular/core";
import { AbsClassNonParameterizedRoute } from "@synergia-frontend/abstracts";
import { IDoBasicEventInfo } from "@synergia-frontend/interfaces";
import { RoutingService } from "@synergia-frontend/services";
import { RegistrarProjetosViewComponent } from "@synergia-frontend/views";

@Component({
  standalone: true,
  selector: 'app-registrar-projetos-route',
  template: `
    <lib-registrar-projetos-view
      (goToLastPageEvent)="goToLastPage()"
    ></lib-registrar-projetos-view>
  `,
  styleUrl: `./style.scss`,
  imports: [RegistrarProjetosViewComponent],
})
export class RegistrarProjetosRouteComponent
implements AbsClassNonParameterizedRoute, OnInit {
  public readonly data$ = signal<IDoBasicEventInfo[]>([]);

  private readonly routingService = inject(RoutingService);
  
  public ngOnInit() {
    this.setRouteInfo();
  }
  public setRouteInfo() {
    this.routingService.setRouteInfo(this.routingService.newProjects());
  }
  public goToLastPage() {
    this.routingService.goTo(this.routingService.newProjects());
  }
}