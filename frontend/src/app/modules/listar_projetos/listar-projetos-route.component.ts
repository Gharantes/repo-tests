import { Component, OnInit, signal } from "@angular/core";
import { AbsBaseRoute } from "@synergia-frontend/abstracts";
import { ListarProjetosBasicInfoDto, PageListarProjetosResourceService } from "@synergia-frontend/api";
import { IDoBasicProjectInfo } from "@synergia-frontend/interfaces";
import { RoutingService, SessionService, SnackbarService } from "@synergia-frontend/services";
import { ListarProjetosViewComponent } from '@synergia-frontend/views';
import { catchError, EMPTY, map, tap } from "rxjs";

@Component({
    selector: 'app-listar-projetos-route',
    template: `
    <lib-listar-projetos-view
      [data$]="data$"
      (toNewProjectsPageEvent)="toNewProjectsPage()"
    ></lib-listar-projetos-view>
  `,
    styleUrl: `./style.scss`,
    imports: [ListarProjetosViewComponent]
})
export class ListarProjetosRouteComponent
implements AbsBaseRoute, OnInit {

  public readonly data$ = signal<IDoBasicProjectInfo[]>([]);

  constructor(
    private readonly snackService: SnackbarService,
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService,
    private readonly pageService: PageListarProjetosResourceService,
  ) {}
  
  public ngOnInit(): void {
    this.setRouteInfo();
    this.getData();
  }
  public setRouteInfo(): void {
      this.routingService.setRouteInfo(this.routingService.projects())
  }
  public toNewProjectsPage () {
    return this.routingService.goTo(this.routingService.newProjects());
  }

  public getData() {
    this.pageService.listarProjetosAll({
      idTenant: this.sessionService.getTenantId() as number
    }).pipe(
      catchError(err => {
        this.snackService.addMessage('Erro ao listar projetos');
        return EMPTY;
      }),
      map(res => this.mapResponse(res)),
      tap(res => this.data$.set(res))
    ).subscribe()
  }
  private mapResponse(res: ListarProjetosBasicInfoDto[]): IDoBasicProjectInfo[] {
    return res.map(v => ({
      id: v.id,
      description: v.description,
      title: v.title
    }))
  }
}