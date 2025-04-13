import { Component, inject, OnInit, signal } from "@angular/core";
import { AbsClassNonParameterizedRoute } from "@synergia-frontend/abstracts";
import { PageCreateProjetoResourceService } from "@synergia-frontend/api";
import { IDoBasicEventInfo, IDoRegistrarProjeto } from "@synergia-frontend/interfaces";
import { RoutingService, SessionService } from "@synergia-frontend/services";
import { RegistrarProjetosViewComponent } from "@synergia-frontend/views";
import { catchError, EMPTY } from "rxjs";

@Component({
    selector: 'app-registrar-projetos-route',
    template: `
    <lib-registrar-projetos-view
      (goToLastPageEvent)="goToLastPage()"
      (registrarEntidadeEvent)="registrarEntidade($event)"
    ></lib-registrar-projetos-view>
  `,
    styleUrl: `./style.scss`,
    imports: [RegistrarProjetosViewComponent]
})
export class RegistrarProjetosRouteComponent
implements AbsClassNonParameterizedRoute, OnInit {
  public readonly data$ = signal<IDoBasicEventInfo[]>([]);

  private readonly sessionService = inject(SessionService);
  private readonly routingService = inject(RoutingService);
  private readonly pageService = inject(PageCreateProjetoResourceService);
  
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
    this.pageService.createProjeto({
      title: $event.title,
      description: $event.description,
      idTenant: this.sessionService.getTenantId()
    }).pipe(
      catchError(err => {
        return EMPTY;
      })
    ).subscribe();
  }
}