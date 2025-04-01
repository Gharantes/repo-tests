import { Component, inject, OnInit, signal } from "@angular/core";
import { AbsClassNonParameterizedRoute } from "@synergia-frontend/abstracts";
import { ProjectResourceService } from "@synergia-frontend/api";
import { IDoBasicEventInfo, IDoRegistrarProjeto } from "@synergia-frontend/interfaces";
import { RoutingService } from "@synergia-frontend/services";
import { RegistrarProjetosViewComponent } from "@synergia-frontend/views";
import { catchError, EMPTY } from "rxjs";

@Component({
  standalone: true,
  selector: 'app-registrar-projetos-route',
  template: `
    <lib-registrar-projetos-view
      (goToLastPageEvent)="goToLastPage()"
      (registrarEntidadeEvent)="registrarEntidade($event)"
    ></lib-registrar-projetos-view>
  `,
  styleUrl: `./style.scss`,
  imports: [RegistrarProjetosViewComponent],
})
export class RegistrarProjetosRouteComponent
implements AbsClassNonParameterizedRoute, OnInit {
  public readonly data$ = signal<IDoBasicEventInfo[]>([]);

  private readonly routingService = inject(RoutingService);
  private readonly projetosService = inject(ProjectResourceService);
  
  public ngOnInit() {
    this.setRouteInfo();
  }
  public setRouteInfo() {
    this.routingService.setRouteInfo(this.routingService.newProjects());
  }
  public goToLastPage() {
    this.routingService.goTo(this.routingService.newProjects());
  }

  public registrarEntidade($event: IDoRegistrarProjeto) {
    this.projetosService.createProject({
      title: $event.title,
      description: $event.description,
      idTenant: 1
    }).pipe(
      catchError(err => {
        return EMPTY;
      })
    ).subscribe();
  }
}