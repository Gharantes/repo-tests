import { Component, OnInit, signal } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AbsBaseRoute } from "@synergia-frontend/abstracts";
import { ListarEventosBasicInfoDto } from "@synergia-frontend/api";
import { IDoBasicEventInfo } from "@synergia-frontend/interfaces";
import { RoutingService, SessionService } from "@synergia-frontend/services";
import { tap } from "rxjs";
import { PageListarProjetosOfEventoResourceService } from "src/libs/api/src/lib/api/pageListarProjetosOfEventoResource.service";
import { ListarProjetosOfEventoDto } from "src/libs/api/src/lib/model/listarProjetosOfEventoDto";

@Component({
    selector: 'app-detalhes-eventos-route',
    template: `

      <div id="projetos-registrados-container">
        <div class="label">Projetos registrados:</div>
        <div id="projetos-registrados-for-container">
          @for (item of listaProjetos(); track $index) {
            <div class="entry">
              {{ item.title }}
            </div>
          }
        </div>
        
      </div>
    `,
    styleUrl: `./style.scss`,
})
export class DetalhesEventosRouteComponent
implements AbsBaseRoute, OnInit {
  private readonly idEvento = signal<number | null>(null);
  public readonly listaProjetos = signal<ListarProjetosOfEventoDto[]>([]);

  constructor (
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService,
    private readonly pageService: PageListarProjetosOfEventoResourceService,
    private readonly activatedRoute: ActivatedRoute
  ) {}
  
  public ngOnInit() {
    this.setRouteInfo();
    this.routingService.getParamFromRoute(this.activatedRoute, "id_event").then((id) => {
      if (id == null) { 
        this.routingService.goTo(this.routingService.events()) 
        return;
      } else {
        this.idEvento.set(Number(id));
        this.buscarProjetosRegistrados()
      }
    })
  }

  public setRouteInfo() {
    this.routingService.setRouteInfo(this.routingService.events());
  }
  private buscarProjetosRegistrados() {
    this.pageService.listarProjetosOfEvento({
      idTenant: this.sessionService.getTenantId() as number,
      idEvent: this.idEvento() as number
    }).pipe(
      tap(res => {
        this.listaProjetos.set(res);
      })
    ).subscribe()
  }
  private mapResponse(res: ListarEventosBasicInfoDto[]): IDoBasicEventInfo[] {
    return res.map(v => ({
      ...v
    }))
  }
}