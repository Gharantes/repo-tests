import { Component, inject, OnInit, signal } from "@angular/core";
import { AbsBaseRoute } from "@synergia-frontend/abstracts";
import { ListarEventosDto, ListarProjetosAllDto, PageListarEventosResourceService, PageListarProjetosResourceService } from "@synergia-frontend/api";
import { RoutingService, SessionService } from "@synergia-frontend/services";
import { filter, map, of, tap } from "rxjs";

@Component({
  selector: 'app-dashboard-route',
  standalone: true,
  templateUrl: 'index.html',
  styleUrl: `style.scss`,
  imports: []
})
export class DashboardRouteComponent 
implements AbsBaseRoute, OnInit {
  public readonly data$ = of(['teste', 'abc']);

  public readonly projetos = signal<ListarProjetosAllDto[]>([]);
  public readonly eventos = signal<ListarEventosDto[]>([]);
  
  constructor (
    private readonly sessionService: SessionService,
    private readonly listarProjetos: PageListarProjetosResourceService,
    private readonly listarEventos: PageListarEventosResourceService,
  ) {
    this.listarProjetos.listarProjetosAll({
      idTenant: this.sessionService.getTenantId()!,
      idAccount: this.sessionService.getUserId()!
    }).pipe(
      map(res => res.filter(v => v.userIsMember)), 
      tap(res => this.projetos.set(res))
    ).subscribe()

    this.listarEventos.listarEventosAll({
      idTenant: this.sessionService.getTenantId()!,
      idAccount: this.sessionService.getUserId()!
    }).pipe(
      map(res => res.filter(v => v.userIsMember)),
      tap(res => this.eventos.set(res))
    ).subscribe()
  }

  private readonly routingService = inject(RoutingService);

  public ngOnInit(): void {
      this.setRouteInfo();
  }
  public setRouteInfo(): void {
      this.routingService.setRouteInfo(this.routingService.dashboard());
  }
}