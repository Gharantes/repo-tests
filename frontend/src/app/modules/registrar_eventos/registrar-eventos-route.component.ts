import { Component, OnInit } from '@angular/core';
import {
  AbsClassChildRoute, InsertUpdateHandler
} from '@synergia-frontend/abstracts';
import {
  CreateEventoDto,
  PageCreateEventoResourceService,
  PageListarEventosResourceService,
} from '@synergia-frontend/api';
import { IDoRegistrarEvento } from '@synergia-frontend/interfaces';
import {
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import { RegistrarEventosViewComponent } from '@synergia-frontend/views';
import { catchError, EMPTY, map, Subject, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  mapFromIDoRegistrarEventoToCreateEventoDto,
  mapFromListarEventosDtoToIDoRegistrarEvento
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
export class RegistrarEventosRouteComponent implements OnInit, AbsClassChildRoute
{
  public readonly insertUpdateHandler = new InsertUpdateHandler<IDoRegistrarEvento, CreateEventoDto, string>()

  constructor(
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService,
    private readonly pageService: PageCreateEventoResourceService,
  ) {

    this.insertUpdateHandler.getPrimaryKey();

    this.insertUpdateHandler.setInsertMapper(
      (el: IDoRegistrarEvento) => mapFromIDoRegistrarEventoToCreateEventoDto(
        el,
        this.sessionService.getTenantId() as number,
        this.sessionService.getUserId() as number
      )
    )
    this.insertUpdateHandler.setRegistrarEntidadeFn(
      (el: CreateEventoDto) => this.pageService.createEvento(el)
    );
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