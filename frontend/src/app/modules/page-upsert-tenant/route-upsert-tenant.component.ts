import { Component, inject } from '@angular/core';
import { RoutingService, SnackbarService } from '@synergia-frontend/services';
import { catchError, EMPTY, tap } from 'rxjs';
import { EntityTenantResourceService } from '@synergia-frontend/api';
import { ViewUpsertTenantComponent } from './view/view-upsert-tenant.component';
import { ConnectorCreateTenant } from './connector/connector-create-tenant';

@Component({
  selector: 'app-registrar-tenant-route',
  standalone: true,
  templateUrl: './route-upsert-tenant.component.html',
  styleUrl: `./route-upsert-tenant.component.scss`,
  imports: [ViewUpsertTenantComponent],
  providers: [ConnectorCreateTenant],
})
export class RouteUpsertTenantComponent {
  public readonly connector = inject(ConnectorCreateTenant);

  constructor(
    public readonly routingService: RoutingService,
    private readonly snackService: SnackbarService,
    private readonly entityTenantService: EntityTenantResourceService
  ) {}

  public createTenant() {
    const data$ = this.connector.form.value;

    this.entityTenantService
      .createTenant({
        identifier: data$.identifier as string,
        title: data$.title as string,
        password: data$.password as string,
        isPrivate: data$.isPrivate as boolean,
      })
      .pipe(
        catchError((err) => {
          this.snackService.catchError(err, 'Erro ao criar Tenant.');
          return EMPTY;
        }),
        tap(() => {
          this.snackService.showMessage('Tenant criado com sucesso.');
          this.routingService.goToLogin();
        })
      )
      .subscribe();
  }
}