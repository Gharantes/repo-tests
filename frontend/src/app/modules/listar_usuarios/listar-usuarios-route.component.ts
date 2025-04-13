import { Component, inject, OnInit, signal } from "@angular/core";
import { AbsClassNonParameterizedRoute } from "@synergia-frontend/abstracts";
import { ListarUsuariosBasicInfoDto, PageListarUsuariosResourceService } from "@synergia-frontend/api";
import { IDoBasicUsuarioInfo } from "@synergia-frontend/interfaces";
import { RoutingService, SnackbarService } from "@synergia-frontend/services";
import { ListarUsuariosViewComponent } from '@synergia-frontend/views';
import { catchError, EMPTY, map, tap } from "rxjs";

@Component({
    selector: 'app-listar-usuarios-route',
    template: `
    <lib-listar-usuarios-view
      [data$]="data$"
      (toNewUserPageEvent)="toNewUserPage()"
    ></lib-listar-usuarios-view>
  `,
    styleUrl: `./style.scss`,
    imports: [ListarUsuariosViewComponent]
})
export class ListarUsuariosRouteComponent
implements AbsClassNonParameterizedRoute, OnInit {
  public readonly data$ = signal<IDoBasicUsuarioInfo[]>([]);

  private readonly snackService = inject(SnackbarService);
  private readonly routingService = inject(RoutingService);
  private readonly pageService = inject(PageListarUsuariosResourceService)
  
  public ngOnInit(): void {
      this.setRouteInfo();
      this.getData()
  }
  public setRouteInfo(): void {
    this.routingService.setRouteInfo(this.routingService.users());
  }
  public toNewUserPage() {
    this.routingService.goTo(this.routingService.newUsers());
  }
  public getData() {
    return this.pageService.listarUsuariosAll().pipe(
      catchError(err => {
        this.snackService.addMessage('Erro ao trazer usuários.');
        return EMPTY;
      }),
      map(res => this.mapData(res)),
      tap(res => this.data$.set(res))
    ).subscribe()
  }

  private mapData(res: ListarUsuariosBasicInfoDto[]): IDoBasicUsuarioInfo[] {
    return res.map(v => ({ ...v }))
  }
}