import { Component, inject, OnInit, signal } from "@angular/core";
import { AbsClassNonParameterizedRoute } from "@synergia-frontend/abstracts";
import { ListarProjetosBasicInfoDto, PageListarProjetosResourceService } from "@synergia-frontend/api";
import { IDoBasicProjectInfo } from "@synergia-frontend/interfaces";
import { RoutingService, SessionService } from "@synergia-frontend/services";
import { ListarProjetosViewComponent } from '@synergia-frontend/views';
import { map, tap } from "rxjs";

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
implements AbsClassNonParameterizedRoute, OnInit {
  public readonly data$ = signal<IDoBasicProjectInfo[]>([]);

  private readonly routingService = inject(RoutingService);
  private readonly sessionService = inject(SessionService);
  private readonly pageService = inject(PageListarProjetosResourceService);
  
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
    this.pageService.listarProjetosAll().pipe(
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