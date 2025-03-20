import { Component, inject, OnInit } from "@angular/core";
import { ListarProjetosViewComponent } from '@synergia-frontend/views';
import { of } from "rxjs";
import { AbsClassNonParameterizedRoute } from "src/app/abstracts/abs-class-non-parameterized-route";
import { RoutingService } from "src/app/services/routing.service";

@Component({
  standalone: true,
  selector: 'app-listar-projetos-route',
  template: `
    <lib-listar-projetos-view
      [data$]="data$"
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
}