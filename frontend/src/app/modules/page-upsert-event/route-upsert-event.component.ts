import { Component } from '@angular/core';

@Component({
  selector: 'app-registrar-eventos-route',
  standalone: true,
  templateUrl: './',
  styleUrl: `./route-upsert-event.component.scss`,
  imports: [RegistrarEventosViewComponent],
})
export class RouteUpsertEventComponent {
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
    this.insertUpdateHandler.parentRoute = this.routingService.goToListEvents();

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
    this.routingService.setRouteInfo(this.routingService.goToCreateEvent());
  }
  public goToParentRoute() {
    this.routingService.goTo(this.routingService.goToListEvents());
  }
}