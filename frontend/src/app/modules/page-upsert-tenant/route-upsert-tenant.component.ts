import { Component } from '@angular/core';
import { IUpsertTenantModel } from '@synergia-frontend/interfaces';
import { RoutingService, SnackbarService } from '@synergia-frontend/services';
import { catchError, EMPTY, tap } from 'rxjs';
import { PageUpsertTenantResourceService } from '@synergia-frontend/api';
import { ViewUpsertTenantComponent } from './view/view-upsert-tenant.component';

@Component({
  selector: 'app-registrar-tenant-route',
  standalone: true,
  templateUrl: './route-upsert-tenant.component.html',
  styleUrl: `./route-upsert-tenant.component.scss`,
  imports: [ViewUpsertTenantComponent],
})
export class RouteUpsertTenantComponent {
  constructor(
    public readonly routingService: RoutingService,
    private readonly snackService: SnackbarService,
    private readonly pageService: PageUpsertTenantResourceService
  ) {}
  public createTenant($event: IUpsertTenantModel) {
    this.pageService
      .createTenant({
        identifier: $event.identifier,
        title: $event.title,
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