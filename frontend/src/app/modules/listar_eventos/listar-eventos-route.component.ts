import { Component, inject, OnInit, signal } from "@angular/core";
import { AbsClassNonParameterizedRoute } from "@synergia-frontend/abstracts";
import { ListarEventosBasicInfoDto, PageListarEventosResourceService } from "@synergia-frontend/api";
import { IDoBasicEventInfo } from "@synergia-frontend/interfaces";
import { RoutingService, SessionService } from "@synergia-frontend/services";
import { ListarEventosViewComponent } from '@synergia-frontend/views';
import { map, tap } from "rxjs";

@Component({
    selector: 'app-listar-eventos-route',
    template: `
    <lib-listar-eventos-view
      [data$]="data$"
      (toNewEventPageEvent)="toNewEventPageEvent()"
    ></lib-listar-eventos-view>
  `,
    styleUrl: `./style.scss`,
    imports: [ListarEventosViewComponent]
})
export class ListarEventosRouteComponent
implements AbsClassNonParameterizedRoute, OnInit {
  public readonly data$ = signal<IDoBasicEventInfo[]>([]);

  private readonly routingService = inject(RoutingService);
  private readonly sessionService = inject(SessionService);
  private readonly pageService = inject(PageListarEventosResourceService);
  
  public ngOnInit() {
    this.setRouteInfo();
    this.getData();
  }

  public setRouteInfo() {
    this.routingService.setRouteInfo(this.routingService.events());
  }
  public toNewEventPageEvent() {
    this.routingService.goTo(this.routingService.newEvents())
  }


  public getData() {
    this.pageService.listarEventosAll().pipe(
      map(res => this.mapResponse(res)),
      tap(res => this.data$.set(res))
    ).subscribe()
  }
  private mapResponse(res: ListarEventosBasicInfoDto[]): IDoBasicEventInfo[] {
    return res.map(v => ({
      ...v
    }))
  }
}