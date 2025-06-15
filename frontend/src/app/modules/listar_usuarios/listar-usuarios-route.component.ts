import { Component, OnInit, signal } from '@angular/core';
import { AbsBaseRoute } from '@synergia-frontend/abstracts';
import {
  ListarUsuariosBasicInfoDto,
  PageListarUsuariosResourceService,
} from '@synergia-frontend/api';
import { IDoBasicUsuarioInfo } from '@synergia-frontend/interfaces';
import {
  RoutingService,
  SessionService,
  Snackbar2Service,
} from '@synergia-frontend/services';
import { ListarUsuariosViewComponent } from '@synergia-frontend/views';
import { catchError, concatMap, EMPTY, map, tap } from 'rxjs';

@Component({
  selector: 'app-page-listar-usuarios-route',
  standalone: true,
  template: `
    <lib-page-listar-usuarios-view
      [data$]="data$"
      (toNewUserPageEvent)="toNewUserPage()"
      (deleteEntryEvent)="deleteEntry($event)"
      (editEntryEvent)="editEntry($event)"
    ></lib-page-listar-usuarios-view>
  `,
  styleUrl: `./style.scss`,
  imports: [ListarUsuariosViewComponent],
})
export class ListarUsuariosRouteComponent implements AbsBaseRoute, OnInit {
  public readonly data$ = signal<IDoBasicUsuarioInfo[]>([]);

  constructor(
    private readonly sessionService: SessionService,
    private readonly snackService: Snackbar2Service,
    private readonly routingService: RoutingService,
    private readonly pageService: PageListarUsuariosResourceService
  ) {}

  public ngOnInit(): void {
    this.setRouteInfo();
    this.getData().subscribe();
  }
  public setRouteInfo(): void {
    this.routingService.setRouteInfo(this.routingService.users());
  }
  public toNewUserPage() {
    this.routingService.goTo(this.routingService.newUsers());
  }
  public getData() {
    return this.pageService
      .listarUsuariosAll({
        idTenant: this.sessionService.getTenantId() as number,
      })
      .pipe(
        catchError((err) => {
          this.snackService.catchError(err, 'Erro ao trazer usuários.');
          return EMPTY;
        }),
        map((res) => this.mapData(res)),
        tap((res) => this.data$.set(res))
      )
  }

  private mapData(res: ListarUsuariosBasicInfoDto[]): IDoBasicUsuarioInfo[] {
    return res.map((v) => ({ ...v }));
  }

  deleteEntry($event: IDoBasicUsuarioInfo) {
    this.pageService.deletarUsuario($event.idAccount).pipe(
      catchError(err => {
        this.snackService.catchError(err);
        return EMPTY;
      }),
      concatMap(() => this.getData())
    ).subscribe()
  }

  editEntry($event: number) {
    this.routingService.goTo(this.routingService.editUser($event))
  }
}