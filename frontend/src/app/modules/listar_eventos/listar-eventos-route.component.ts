import { Component, inject, OnInit, signal } from "@angular/core";
import { AbsClassNonParameterizedRoute } from "@synergia-frontend/abstracts";
import { EventDto, EventResourceService } from "@synergia-frontend/api";
import { IDoBasicEventInfo } from "@synergia-frontend/interfaces";
import { RoutingService, SessionService } from "@synergia-frontend/services";
import { ListarEventosViewComponent } from '@synergia-frontend/views';
import { map, tap } from "rxjs";

@Component({
  standalone: true,
  selector: 'app-listar-eventos-route',
  template: `
    <lib-listar-eventos-view
      [data$]="data$"
    ></lib-listar-eventos-view>
  `,
  styleUrl: `./style.scss`,
  imports: [ListarEventosViewComponent],
})
export class ListarEventosRouteComponent
implements AbsClassNonParameterizedRoute, OnInit {
  public readonly data$ = signal<IDoBasicEventInfo[]>([]);

  private readonly routingService = inject(RoutingService);
  private readonly sessionService = inject(SessionService);
  private readonly eventsRService = inject(EventResourceService);
  
  public ngOnInit() {
    this.setRouteInfo();
    this.getData();
  }
  public setRouteInfo() {
    this.routingService.setRouteInfo(this.routingService.events());
  }
  public getData() {
    this.eventsRService.getAllEvent(
      this.sessionService.getTenantId()
    ).pipe(
      map(res => this.mapResponse(res)),
      tap(res => this.data$.set(res))
    ).subscribe()
  }
  private mapResponse(res: EventDto[]): IDoBasicEventInfo[] {
    return res.map(v => ({
      ...v
    }))
  }
}