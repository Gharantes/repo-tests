import { Component } from '@angular/core';
import { PageCreateTenantResourceService } from '@synergia-frontend/api';
import { IRegistrarTenant } from '@synergia-frontend/interfaces';
import { RoutingService, SnackbarService } from '@synergia-frontend/services';
import { RegistrarTenantViewComponent } from '@synergia-frontend/views';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'app-registrar-tenant-route',
  standalone: true,
  templateUrl: './route-upsert-tenant.component.html',
  styleUrl: `./route-upsert-tenant.component.scss`,
  imports: [RegistrarTenantViewComponent],
})
export class RouteUpsertTenantComponent {
  constructor(
    private readonly routingService: RoutingService,
    private readonly snackService: SnackbarService,
    private readonly pageService: PageCreateTenantResourceService
  ) {}
  public createTenant($event: IRegistrarTenant) {
    this.pageService
      .createTenant({
        identifier: $event.identifier,
        title: $event.title,
      })
      .pipe(
        catchError(() => {
          this.snackService.addMessage('Erro ao criar Tenant.');
          return EMPTY;
        }),
        tap(() => {
          this.snackService.addMessage('Tenant criado com sucesso.');
          this.routingService.goTo(this.routingService.login());
        })
      )
      .subscribe();
  }
}