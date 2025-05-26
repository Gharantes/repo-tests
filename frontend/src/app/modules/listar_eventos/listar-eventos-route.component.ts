import { Component, OnInit, signal } from "@angular/core";
import { AbsBaseRoute } from "@synergia-frontend/abstracts";
import { ListarEventosDto, PageListarEventosResourceService } from '@synergia-frontend/api';
import { IDoListarEventos } from "@synergia-frontend/interfaces";
import { RoutingService, SessionService, SnackbarService } from "@synergia-frontend/services";
import { ListarEventosViewComponent } from '@synergia-frontend/views';
import { catchError, concatMap, EMPTY, map, tap } from "rxjs";

@Component({
  selector: 'app-page-listar-eventos-route',
  template: `
    <lib-page-listar-eventos-view
      [data$]="data$"
      (toNewEventPageEvent)="toNewEventPageEvent()"
      (viewDetailsEvent)="viewDetails($event)"
      (deleteEntryEvent)="deleteEntry($event)"
    ></lib-page-listar-eventos-view>
  `,
  styleUrl: `./style.scss`,
  imports: [ListarEventosViewComponent]
})
export class ListarEventosRouteComponent
implements AbsBaseRoute, OnInit {
  public readonly data$ = signal<IDoListarEventos[]>([]);

  constructor (
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService,
    private readonly pageService: PageListarEventosResourceService,
    private readonly snackService: SnackbarService
  ) {}
  
  public ngOnInit() {
    this.setRouteInfo();
    this.getData().subscribe();
  }

  public setRouteInfo() {
    this.routingService.setRouteInfo(this.routingService.events());
  }
  public toNewEventPageEvent() {
    this.routingService.goTo(this.routingService.newEvents())
  }


  public getData() {
    return this.pageService.listarEventosAll({
      idTenant: this.sessionService.getTenantId() as number
    }).pipe(
      map(res => this.mapResponse(res)),
      tap(res => this.data$.set(res))
    );
  }

  private mapResponse(res: ListarEventosDto[]): IDoListarEventos[] {
    return res.map(v => ({
      ...v
    }))
  }

  public viewDetails($event: IDoListarEventos) {
    const destiny = this.routingService.eventDetails($event.id);
    this.routingService.goTo(destiny)
  }
  public deleteEntry($event: IDoListarEventos) {
    this.pageService.deletarEvento($event.id).pipe(
      catchError(() => {
        this.snackService.addMessage("Erro ao deletar Evento.");
        return EMPTY;
      }),
      concatMap(() => this.getData()),
      tap(() => this.snackService.addMessage("Evento deletado com sucesso."))
    ).subscribe()
  }
}