import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { RoutingService } from '@synergia-frontend/services';
import { ConnectorHome } from './connector/connector-home';
import { ViewHomeComponent } from './view/view-home.component';
import { RouteUpsertTenantComponent } from '../page-upsert-tenant/route-upsert-tenant.component';

@Component({
  selector: 'app-route-home',
  standalone: true,
  templateUrl: './route-home.component.html',
  styleUrl: './route-home.component.scss',
  providers: [ConnectorHome],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ViewHomeComponent, RouteUpsertTenantComponent],
})
export class RouteHomeComponent {
  public readonly connector = inject(ConnectorHome);
  public readonly routingService = inject(RoutingService);
  public readonly isCreatingTenant = signal(false);

  public goToTenant() {
    const identifier = this.connector.getIdentifier();
    if (identifier != null) {
      this.routingService.goToLogin(identifier);
    }
  }
}
