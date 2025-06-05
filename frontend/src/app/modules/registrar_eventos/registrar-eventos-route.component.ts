import { Component, OnInit } from '@angular/core';
import {
  AbsClassChildRoute,
  InsertUpdateHandler,
} from '@synergia-frontend/abstracts';
import {
  CreateEventoDto,
  PageCreateEventoResourceService,
  UpdateEventoDto,
} from '@synergia-frontend/api';
import { IDoRegistrarEvento } from '@synergia-frontend/interfaces';
import { RoutingService, SessionService } from '@synergia-frontend/services';
import { RegistrarEventosViewComponent } from '@synergia-frontend/views';
import {
  mapFromCreateEventoDtoToIDoRegistrarEvento,
  mapFromIDoRegistrarEventoToCreateEventoDto,
  mapFromIDoRegistrarEventoToUpdateEventoDto,
} from '@synergia-frontend/mappers';

@Component({
  selector: 'app-registrar-eventos-route',
  standalone: true,
  template: `
    <lib-registrar-eventos-view
      (goToParentPageEvent)="goToParentRoute()"
      (registrarEntidadeEvent)="insertUpdateHandler.save($event)"
      [populateForm]="insertUpdateHandler.populateForm"
    ></lib-registrar-eventos-view>
  `,
  styleUrl: `./style.scss`,
  imports: [RegistrarEventosViewComponent],
})
export class RegistrarEventosRouteComponent
  implements OnInit, AbsClassChildRoute
{
  public readonly insertUpdateHandler = new InsertUpdateHandler<
    IDoRegistrarEvento,
    CreateEventoDto,
    UpdateEventoDto
  >();

  constructor(
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService,
    private readonly pageService: PageCreateEventoResourceService
  ) {
    this.insertUpdateHandler.parentRoute = this.routingService.events();

    this.insertUpdateHandler.setInsertMapper((el: IDoRegistrarEvento) =>
      mapFromIDoRegistrarEventoToCreateEventoDto(
        el,
        this.sessionService.getTenantId() as number,
        this.sessionService.getUserId() as number
      )
    );
    this.insertUpdateHandler.setUpdateMapper(
      (el: IDoRegistrarEvento, id: number) =>
        mapFromIDoRegistrarEventoToUpdateEventoDto(
          el,
          id,
          this.sessionService.getTenantId() as number
        )
    );
    this.insertUpdateHandler.setReverseInsertMapper((el: CreateEventoDto) =>
        mapFromCreateEventoDtoToIDoRegistrarEvento(el)
    );

    this.insertUpdateHandler.setGetByIdFn((id: number) =>
      this.pageService.getCreateEventoDtoById(id)
    );
    this.insertUpdateHandler.setRegistrarEntidadeFn((el: CreateEventoDto) =>
      this.pageService.createEvento(el)
    );
    this.insertUpdateHandler.setAtualizarEntidadeFn((el: UpdateEventoDto) =>
      this.pageService.updateEvento(el)
    );

    this.insertUpdateHandler.getPrimaryKey();
  }

  public ngOnInit() {
    this.setRouteInfo();
  }
  private setRouteInfo() {
    this.routingService.setRouteInfo(this.routingService.newEvents());
  }
  public goToParentRoute() {
    this.routingService.goTo(this.routingService.events());
  }
}