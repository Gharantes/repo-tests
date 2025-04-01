import { Component, inject, OnInit, signal, Signal } from "@angular/core";
import { AbsClassNonParameterizedRoute } from "@synergia-frontend/abstracts";
import { AccountResourceService } from "@synergia-frontend/api";
import { IDoBasicUsuarioInfo } from "@synergia-frontend/interfaces";
import { RoutingService } from "@synergia-frontend/services";
import { ListarUsuariosViewComponent } from '@synergia-frontend/views';
import { of } from "rxjs";

@Component({
  standalone: true,
  selector: 'app-listar-usuarios-route',
  template: `
    <lib-listar-usuarios-view
      [data$]="data$"
      (toNewUserPageEvent)="toNewUserPage()"
    ></lib-listar-usuarios-view>
  `,
  styleUrl: `./style.scss`,
  imports: [ListarUsuariosViewComponent],
})
export class ListarUsuariosRouteComponent
implements AbsClassNonParameterizedRoute, OnInit {
  public readonly data$ = signal<IDoBasicUsuarioInfo[]>([]);

  private readonly routingService = inject(RoutingService);
  private readonly usuariosService = inject(AccountResourceService)
  
  public ngOnInit(): void {
      this.setRouteInfo();
  }
  public setRouteInfo(): void {
    this.routingService.setRouteInfo(this.routingService.users());
  }
  public toNewUserPage() {
    this.routingService.goTo(this.routingService.newUsers());
  }

  public getData() {
    return this.usuariosService.getAllAccounts(1).pipe().subscribe()
  }
}