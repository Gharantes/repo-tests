import { Component, OnInit, signal } from "@angular/core";
import { AbsClassChildRoute, AbsClassInsertRoute } from "@synergia-frontend/abstracts";
import { CreateEventoDto, PageCreateEventoResourceService } from "@synergia-frontend/api";
import { IDoListarEventos, IDoRegistrarEvento } from "@synergia-frontend/interfaces";
import { RoutingService, SessionService, SnackbarService } from "@synergia-frontend/services";
import { RegistrarEventosViewComponent } from "@synergia-frontend/views";
import { catchError, EMPTY, tap } from "rxjs";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registrar-eventos-route',
  standalone: true,
  template: `
    <lib-registrar-eventos-view
      (goToParentPageEvent)="goToParentRoute()"
      (registrarEntidadeEvent)="registrarEntidade($event)"
    ></lib-registrar-eventos-view>
  `,
  styleUrl: `./style.scss`,
  imports: [RegistrarEventosViewComponent]
})
export class RegistrarEventosRouteComponent
implements OnInit, AbsClassChildRoute, AbsClassInsertRoute<IDoRegistrarEvento> {
  public readonly data$ = signal<IDoListarEventos[]>([]);


  constructor(
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService,
    private readonly snackService: SnackbarService,
    private readonly pageService: PageCreateEventoResourceService,
    private readonly activatedRoute: ActivatedRoute
  ) {
    this.routingService.getParamFromRoute(this.activatedRoute, "id").then(res => {
      console.log(res)
    })
  }
  

  public ngOnInit() {
    this.setRouteInfo();
  }
  private setRouteInfo() {
    this.routingService.setRouteInfo(this.routingService.newEvents());
  }
  public goToParentRoute() {
    this.routingService.goTo(this.routingService.events());
  }
  public registrarEntidade($event: IDoRegistrarEvento) {
    const dto = this.mapToDto($event);
    this.pageService.createEvento(dto).pipe(
      catchError(() => {
        this.snackService.addMessage('Erro ao registrar evento.');
        return EMPTY;
      }),
      tap(() => {
        this.snackService.addMessage('Evento registrado com sucesso.');
        this.goToParentRoute();
      }),
    ).subscribe()
  }
  private mapToDto($event: IDoRegistrarEvento): CreateEventoDto {
    return {
      title: $event.title,
      description: $event.description,
      idTenant: this.sessionService.getTenantId() as number,
      createdByIdAccount: this.sessionService.getUserId() as number,
      urlBanner: $event.urlBanner ?? undefined
    }
  }
}