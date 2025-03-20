import { Component, inject, OnInit, signal } from "@angular/core";
import { EventDto, EventResourceService } from "@synergia-frontend/api";
import { ListarEventosViewComponent } from '@synergia-frontend/views';
import { map, of, tap } from "rxjs";
import { AbsClassNonParameterizedRoute } from "src/app/abstracts/abs-class-non-parameterized-route";
import { RoutingService } from "src/app/services/routing.service";
import { SessionService } from "src/app/services/session.service";

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
  public readonly data$ = signal<string>(['teste', 'abc']);

  private readonly routingService = inject(RoutingService);
  private readonly sessionService = inject(SessionService);
  private readonly eventsRService = inject(EventResourceService);
  
  public ngOnInit() {
    this.setRouteInfo();
  }
  public setRouteInfo() {
    this.routingService.setRouteInfo(this.routingService.events());
  }
  public getData() {
    this.eventsRService.getAllEvent(
      this.sessionService.getTenantId()
    ).pipe(
      map(res => this.mapResponse(res)),
      tap(res => this.data$)
    ).subscribe()
  }
  private mapResponse(res: EventDto[]) {
    
  }
}