import { PageCreateUsuarioResourceService } from './../../../libs/api/src/lib/api/pageCreateUsuarioResource.service';
import { Component, inject, OnInit, signal } from "@angular/core";
import { AbsBaseRoute } from "@synergia-frontend/abstracts";
import { IDoBasicEventInfo, IDoRegistrarUsuario } from "@synergia-frontend/interfaces";
import { RoutingService, SessionService, SnackbarService } from "@synergia-frontend/services";
import { RegistrarUsuariosViewComponent } from "@synergia-frontend/views";
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
    selector: 'app-registrar-usuarios-route',
    template: `
    <lib-registrar-usuarios-view
      (goToParentPageEvent)="goToLastPage()"
      (registrarEntidadeEvent)="registrarEntidade($event)"
    ></lib-registrar-usuarios-view>
  `,
    styleUrl: `./style.scss`,
    imports: [RegistrarUsuariosViewComponent]
})
export class RegistrarUsuariosRouteComponent
implements AbsBaseRoute, OnInit {
  public readonly data$ = signal<IDoBasicEventInfo[]>([]);

  private readonly pageService = inject(PageCreateUsuarioResourceService);
  private readonly routingService = inject(RoutingService);
  private readonly sessionService = inject(SessionService);
  private readonly snackService = inject(SnackbarService);

  public ngOnInit() {
    this.setRouteInfo();
  }
  public setRouteInfo() {
    this.routingService.setRouteInfo(this.routingService.newUsers());
  }
  public goToLastPage() {
    this.routingService.goTo(this.routingService.users());
  }
  public registrarEntidade($event: IDoRegistrarUsuario) {
    this.pageService.createUsuario({
      idTenant: this.sessionService.getTenantId() as number,
      firstName: $event.firstName,
      lastName: $event.lastName,
      login: $event.login,
      password: $event.password
    }).pipe(
      catchError(() => {
        this.snackService.addMessage('Erro ao criar usuário');
        return EMPTY;
      }),
      tap(() => {
        this.snackService.addMessage('Usuário criado com sucesso.');
        this.goToLastPage();
      })
    ).subscribe()
  }
}