import { Component, inject, ChangeDetectionStrategy, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EntityTenantResourceService } from '@synergia-frontend/api';
import { RoutingService, SnackbarService } from '@synergia-frontend/services';
import { TenantDtoToModel } from '@synergia-frontend/mappers';
import { finalize } from 'rxjs';
import { ConnectorHome } from './connector/connector-home';
import { ViewHomeComponent } from './view/view-home.component';
import { RouteUpsertTenantComponent } from '../page-upsert-tenant/route-upsert-tenant.component';
import { RouteListTenantsComponent } from '../page-list-tenants/route-list-tenants.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

type HomeSection = 'access' | 'create-tenant' | 'list-tenants';

@Component({
  selector: 'app-route-home',
  standalone: true,
  templateUrl: './route-home.component.html',
  styleUrl: './route-home.component.scss',
  providers: [ConnectorHome],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ViewHomeComponent, RouteUpsertTenantComponent, RouteListTenantsComponent, MatButtonModule, MatIconModule],
})
export class RouteHomeComponent {
  public readonly connector = inject(ConnectorHome);
  public readonly routingService = inject(RoutingService);
  private readonly tenantService = inject(EntityTenantResourceService);
  private readonly snackService = inject(SnackbarService);
  private readonly destroyRef = inject(DestroyRef);
  public readonly section = signal<HomeSection>('access');

  /** Verifica se o tenant existe antes de navegar para o login dele. */
  public goToTenant() {
    const identifier = this.connector.getIdentifier();
    if (identifier == null || this.connector.checking$()) {
      return;
    }

    this.connector.checking$.set(true);
    this.tenantService
      .listAllTenants()
      .pipe(
        finalize(() => this.connector.checking$.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (res) => {
          const exists = res.map((v) => TenantDtoToModel(v)).some((t) => t.identifier === identifier);
          if (exists) {
            this.routingService.goToLogin(identifier);
          } else {
            this.connector.notFound$.set(identifier);
          }
        },
        error: (err) => this.snackService.catchError(err, 'Erro ao verificar o tenant.'),
      });
  }
}
