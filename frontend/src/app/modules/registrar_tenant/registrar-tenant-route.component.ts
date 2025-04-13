import { Component, inject, OnInit } from "@angular/core";
import { AbsClassNonParameterizedRoute } from "@synergia-frontend/abstracts";
import { PageCreateTenantResourceService } from "@synergia-frontend/api";
import { IDoRegistrarTenant } from "@synergia-frontend/interfaces";
import { RoutingService, SnackbarService } from "@synergia-frontend/services";
import { RegistrarTenantViewComponent } from "@synergia-frontend/views";
import { catchError, EMPTY, tap } from "rxjs";

@Component({
    selector: 'app-registrar-tenant-route',
    template: `
    <lib-registrar-tenant-view
      (goToParentPageEvent)="goToLastPage()"
      (registrarEntidadeEvent)="registrarEntidade($event)"
    ></lib-registrar-tenant-view>
  `,
    styleUrl: `./style.scss`,
    imports: [RegistrarTenantViewComponent]
})
export class RegistrarTenantRouteComponent
implements AbsClassNonParameterizedRoute, OnInit {

  private readonly routingService = inject(RoutingService);
  private readonly snackService = inject(SnackbarService);
  private readonly pageService = inject(PageCreateTenantResourceService);

  public ngOnInit() {
    this.setRouteInfo();
  }
  public setRouteInfo() {
    this.routingService.setRouteInfo(this.routingService.createTenant());
  }
  public goToLastPage() {
    this.routingService.goTo(this.routingService.login());
  }
  public registrarEntidade($event: IDoRegistrarTenant) {
    this.pageService.createTenant({
      identifier: $event.identifier,
      title: $event.title
    }).pipe(
      catchError(() => {
        this.snackService.addMessage('Erro ao criar Tenant.');
        return EMPTY;
      }),
      tap(() => {
        this.snackService.addMessage('Tenant criado com sucesso.');
        this.routingService.goTo(this.routingService.login());
      })
    ).subscribe()

  }
}