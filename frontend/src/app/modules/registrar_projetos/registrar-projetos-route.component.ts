import { Component, OnInit, signal } from '@angular/core';
import { InsertUpdateHandler } from '@synergia-frontend/abstracts';
import {
  CreateProjetoDto,
  PageCreateProjetoResourceService,
  UpdateProjetoDto,
} from '@synergia-frontend/api';
import {
  IDoListarEventos,
  IDoListarTags,
  IDoRegistrarProjeto,
} from '@synergia-frontend/interfaces';
import {
  mapFromCreateProjetoDtoToIDoRegistrarProjeto,
  mapFromIDoRegistrarProjetoToCreateProjetoDto, mapFromIDoRegistrarProjetoToUpdateProjetoDto
} from '@synergia-frontend/mappers';
import { RoutingService, SessionService } from '@synergia-frontend/services';
import { RegistrarProjetosViewComponent } from '@synergia-frontend/views';
import { PageListarTagsResourceService } from './../../../libs/api/src/lib/api/pageListarTagsResource.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-registrar-projetos-route',
  standalone: true,
  template: `
    <lib-registrar-projetos-view
      [listaEventos]="listaEventos()"
      [tags]="tags()"
      [populateForm]="insertUpdateHandler.populateForm"
      (goToParentPageEvent)="goToLastPage()"
      (registrarEntidadeEvent)="insertUpdateHandler.save($event)"
    ></lib-registrar-projetos-view>
  `,
  styleUrl: `./style.scss`,
  imports: [RegistrarProjetosViewComponent],
})
export class RegistrarProjetosRouteComponent implements OnInit {
  public readonly listaEventos = signal<IDoListarEventos[]>([]);

  public readonly insertUpdateHandler = new InsertUpdateHandler<
    IDoRegistrarProjeto,
    CreateProjetoDto,
    UpdateProjetoDto
  >();

  public readonly tags = signal<IDoListarTags[]>([]);

  constructor(
    private readonly sessionService: SessionService,
    private readonly routingService: RoutingService,
    private readonly pageService: PageCreateProjetoResourceService,
    private readonly pageListarTagsService: PageListarTagsResourceService
  ) {
    this.insertUpdateHandler.parentRoute = this.routingService.projects();

    this.insertUpdateHandler.setGetByIdFn((id: number) =>
      this.pageService.getCreateProjetoDtoById(id)
    );
    this.insertUpdateHandler.setRegistrarEntidadeFn((el: CreateProjetoDto) =>
      this.pageService.createProjeto(el)
    );
    this.insertUpdateHandler.setAtualizarEntidadeFn((el: UpdateProjetoDto) =>
      this.pageService.updateProjeto(el)
    );
    this.insertUpdateHandler.setReverseInsertMapper((el: CreateProjetoDto) =>
      mapFromCreateProjetoDtoToIDoRegistrarProjeto(el)
    );
    this.insertUpdateHandler.setInsertMapper((el: IDoRegistrarProjeto) =>
      mapFromIDoRegistrarProjetoToCreateProjetoDto(
        el,
        this.sessionService.getTenantId() as number,
        this.sessionService.getUserId() as number
      )
    );
    this.insertUpdateHandler.setUpdateMapper(
      (el: IDoRegistrarProjeto, id: number) =>
        mapFromIDoRegistrarProjetoToUpdateProjetoDto(
          el,
          id,
          this.sessionService.getTenantId() as number
        )
    );

    this.insertUpdateHandler.getPrimaryKey()
  }

  public ngOnInit() {
    this.pageListarTagsService.listarTagsAll({
      idTenant: this.sessionService.getTenantId() as number,
      text: undefined,
    }).pipe(
      tap(res => this.tags.set(res))
    ).subscribe()
    
    this.setRouteInfo();
  }
  public setRouteInfo() {
    const id = this.insertUpdateHandler.primaryKey()
    const route = id ? this.routingService.editProject(id) : this.routingService.newProjects()
    this.routingService.setRouteInfo(route);
  }
  public goToLastPage() {
    this.routingService.goTo(this.routingService.projects());
  }
}