import { Component, OnInit, signal } from "@angular/core";
import { AbsBaseRoute } from "@synergia-frontend/abstracts";
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
        (viewDetailsEvent)="viewDetails($event)"
      ></lib-listar-eventos-view>
  `,
    styleUrl: `./style.scss`,
    imports: [ListarEventosViewComponent]
})
export class ListarEventosRouteComponent
implements AbsBaseRoute, OnInit {
  public readonly data$ = signal<IDoBasicEventInfo[]>([]);

  constructor (
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService,
    private readonly pageService: PageListarEventosResourceService
  ) {}
  
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
    this.pageService.listarEventosAll({
      idTenant: this.sessionService.getTenantId() as number
    }).pipe(
      map(res => this.mapResponse(res)),
      tap(res => this.data$.set(res))
    ).subscribe()
  }
  private mapResponse(res: ListarEventosBasicInfoDto[]): IDoBasicEventInfo[] {
    return res.map(v => ({
      ...v
    }))
  }

  public viewDetails($event: IDoBasicEventInfo) {
    const destiny = this.routingService.eventDetails($event.id);
    console.log(destiny);
    this.routingService.goTo(destiny)
  }
}