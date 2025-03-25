import { Component, inject, OnInit, signal } from "@angular/core";
import { AbsClassChildRoute, AbsClassInsertRoute } from "@synergia-frontend/abstracts";
import { EventResourceService } from "@synergia-frontend/api";
import { IDoBasicEventInfo, IDoNewEvent } from "@synergia-frontend/interfaces";
import { RegistrarEventosViewComponent } from "@synergia-frontend/views";

@Component({
  standalone: true,
  selector: 'app-registrar-eventos-route',
  template: `
    <lib-registrar-eventos-view
      (goToParentPageEvent)="goToParentPage()"
      (registrarEntidadeEvent)="registrarEntidade($event)"
    ></lib-registrar-eventos-view>
  `,
  styleUrl: `./style.scss`,
  imports: [RegistrarEventosViewComponent],
})
export class RegistrarEventosRouteComponent
extends AbsClassChildRoute
implements OnInit, AbsClassInsertRoute<IDoNewEvent> {
  public readonly data$ = signal<IDoBasicEventInfo[]>([]);

  override parentRoute = this.routingService.events();

  private readonly eventRService = inject(EventResourceService);
  
  public ngOnInit() {
    this.setRouteInfo();
  }
  public setRouteInfo() {
    this.routingService.setRouteInfo(this.routingService.newEvents());
  }
  goToParentPage() {
    this.routingService.goTo(this.routingService.events());
  }
  public registrarEntidade($event: IDoNewEvent) {
    console.log($event);
    // const dto = this.mapToDto($event);
    // this.eventRService.createEvent()
  }
  // private mapToDto($event: any): EventCreateDto {
  //   return {
  //     title: ,
  //     description: ,
  //     idTenant: this.SessionService.getTenantId().
  //   }
  // }
}