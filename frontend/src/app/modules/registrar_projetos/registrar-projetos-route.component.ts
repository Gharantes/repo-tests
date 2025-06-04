import { Component, OnInit, signal } from "@angular/core";
import { AbsBaseRoute } from "@synergia-frontend/abstracts";
import { PageCreateProjetoResourceService, PageListarEventosResourceService } from "@synergia-frontend/api";
import { IDoListarEventos, IDoRegistrarProjeto } from "@synergia-frontend/interfaces";
import { RoutingService, SessionService, SnackbarService } from "@synergia-frontend/services";
import { RegistrarProjetosViewComponent } from "@synergia-frontend/views";
import { catchError, EMPTY, map, tap } from "rxjs";

@Component({
  selector: 'app-registrar-projetos-route',
  standalone: true,
  template: `
    <lib-registrar-projetos-view
      [listaEventos]="listaEventos()"
      (goToParentPageEvent)="goToLastPage()"
      (registrarEntidadeEvent)="registrarEntidade($event)"
    ></lib-registrar-projetos-view>
  `,
  styleUrl: `./style.scss`,
  imports: [RegistrarProjetosViewComponent]
})
export class RegistrarProjetosRouteComponent
implements AbsBaseRoute, OnInit {
  public readonly listaEventos = signal<IDoListarEventos[]>([]);


  private idTenant: number;
  constructor (
    private readonly sessionService: SessionService,
    private readonly routingService: RoutingService,
    private readonly pageService: PageCreateProjetoResourceService,
    private readonly listarEventosPageService: PageListarEventosResourceService,
    private readonly snackService: SnackbarService
  ) {
    this.idTenant = this.sessionService.getTenantId() as number;
  }
  
  public ngOnInit() {
    this.setRouteInfo();
    this.buscarListaEventos();
  }
  public setRouteInfo() {
    this.routingService.setRouteInfo(this.routingService.newProjects());
  }
  public goToLastPage() {
    this.routingService.goTo(this.routingService.projects());
  }
  private buscarListaEventos() {
    this.listarEventosPageService.listarEventosAll({
      idTenant: this.idTenant
    }).pipe(
      map(res => res.map(v => ({ ...v } as IDoListarEventos))),
      tap(res => this.listaEventos.set(res)) 
    ).subscribe()
  }

  public registrarEntidade($event: IDoRegistrarProjeto) {
    this.pageService.createProjeto({
      idTenant: this.idTenant,
      title: $event.title,
      description: $event.description,
      eventosSelecionados: $event.eventosSelecionados
    }).pipe(
      catchError(err => {
        this.snackService.addMessage('Erro ao criar Projeto');
        return EMPTY;
      }),
      tap(() => {
        this.snackService.addMessage('Projeto criado com sucesso.');
        this.goToLastPage();
      })
    ).subscribe();
  }
}