import { Component, inject, OnInit, signal } from "@angular/core";
import { AbsClassChildRoute, AbsClassInsertRoute } from "@synergia-frontend/abstracts";
import { CreateEventoDto, PageCreateEventoResourceService } from "@synergia-frontend/api";
import { IDoBasicEventInfo, IDoRegistrarEvento } from "@synergia-frontend/interfaces";
import { SnackbarService } from "@synergia-frontend/services";
import { RegistrarEventosViewComponent } from "@synergia-frontend/views";
import { catchError, EMPTY, tap } from "rxjs";

@Component({
    selector: 'app-registrar-eventos-route',
    template: `
    <lib-registrar-eventos-view
      (goToParentPageEvent)="goToParentPage()"
      (registrarEntidadeEvent)="registrarEntidade($event)"
    ></lib-registrar-eventos-view>
  `,
    styleUrl: `./style.scss`,
    imports: [RegistrarEventosViewComponent]
})
export class RegistrarEventosRouteComponent
extends AbsClassChildRoute
implements OnInit, AbsClassInsertRoute<IDoRegistrarEvento> {
  public readonly data$ = signal<IDoBasicEventInfo[]>([]);

  override parentRoute = this.routingService.events();

  private readonly snackService = inject(SnackbarService);
  private readonly pageService = inject(PageCreateEventoResourceService);
  
  public ngOnInit() {
    this.setRouteInfo();
  }
  public setRouteInfo() {
    this.routingService.setRouteInfo(this.routingService.newEvents());
  }
  goToParentPage() {
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
      idTenant: this.sessionService.getTenantId()
    }
  }
}