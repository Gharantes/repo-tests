import { Component, inject, OnInit } from "@angular/core";
import { AbsClassNonParameterizedRoute } from "@synergia-frontend/abstracts";
import { RoutingService } from "@synergia-frontend/services";
import { ListarProjetosViewComponent } from '@synergia-frontend/views';
import { of } from "rxjs";

@Component({
  standalone: true,
  selector: 'app-listar-projetos-route',
  template: `
    <lib-listar-projetos-view
      [data$]="data$"
      (toNewProjectsPageEvent)="toNewProjectsPage()"
    ></lib-listar-projetos-view>
  `,
  styleUrl: `./style.scss`,
  imports: [ListarProjetosViewComponent],
})
export class ListarProjetosRouteComponent
implements AbsClassNonParameterizedRoute, OnInit {
  public readonly data$ = of(['teste', 'abc']);

  private readonly routingService = inject(RoutingService);
  
  public ngOnInit(): void {
    this.setRouteInfo();
  }
  public setRouteInfo(): void {
      this.routingService.setRouteInfo(this.routingService.projects())
  }

  public toNewProjectsPage () {
    return this.routingService.goTo(this.routingService.newProjects());
  }
}