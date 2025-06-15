import { Component, inject } from '@angular/core';
import { InsertUpdateHandler } from '@synergia-frontend/abstracts';
import { IDoRegistrarUsuario } from '@synergia-frontend/interfaces';
import {
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import { RegistrarUsuariosViewComponent } from '@synergia-frontend/views';
import {
  CreateUsuarioDto,
  PageCreateUsuarioResourceService,
  UpdateUsuarioDto,
} from '@synergia-frontend/api';

@Component({
  selector: 'app-registrar-usuarios-route',
  standalone: true,
  template: `
    <lib-registrar-usuarios-view
      (goToParentPageEvent)="handler.goToParentRoute()"
      (registrarEntidadeEvent)="handler.save($event)"
      [populateForm]="handler.populateForm"
    ></lib-registrar-usuarios-view>
  `,
  styleUrl: `./style.scss`,
  imports: [RegistrarUsuariosViewComponent]
})
export class RegistrarUsuariosRouteComponent {
  public readonly handler = new InsertUpdateHandler<
    IDoRegistrarUsuario,
    CreateUsuarioDto,
    UpdateUsuarioDto
  >()

  private readonly pageService = inject(PageCreateUsuarioResourceService);
  private readonly routingService = inject(RoutingService);
  private readonly sessionService = inject(SessionService);
  private readonly snackService = inject(SnackbarService);


  constructor() {
    this.handler.parentRoute = this.routingService.users()
    this.handler.setAtualizarEntidadeFn((el: UpdateUsuarioDto) =>
      this.pageService.updateUser(el)
    )
    this.handler.setGetByIdFn((id) =>
      this.pageService.getCreateUsuarioDtoById(id)
    )
    this.handler.setRegistrarEntidadeFn((el: CreateUsuarioDto) =>
      this.pageService.createUsuario(el)
    )
    this.handler.setInsertMapper(this.insertMapper())
    this.handler.setUpdateMapper(this.updateMapper())
    this.handler.setReverseInsertMapper(this.reverseInsertMapper())

    this.handler.getPrimaryKey()


    console.log(this.handler.primaryKey())
    this.handler.log()
  }

  private insertMapper(): (el: IDoRegistrarUsuario) => CreateUsuarioDto {
    return (el: IDoRegistrarUsuario) => ({
      idTenant: this.sessionService.getTenantId() as number,
      firstName: el.firstName,
      lastName: el.lastName,
      login: el.login,
      password: el.password
    })
  }
  private updateMapper(): (el: IDoRegistrarUsuario, id: number) => UpdateUsuarioDto {
    return (el: IDoRegistrarUsuario, id: number) => ({
      id: id,
      idTenant: this.sessionService.getTenantId() as number,
      firstName: el.firstName,
      lastName: el.lastName,
      login: el.login,
      password: el.password
    })
  }
  private reverseInsertMapper(): (el: CreateUsuarioDto) => IDoRegistrarUsuario {
    return (el: CreateUsuarioDto) => ({
      firstName: el.firstName,
      lastName: el.lastName,
      login: el.login,
      password: el.password
    })
  }
}

