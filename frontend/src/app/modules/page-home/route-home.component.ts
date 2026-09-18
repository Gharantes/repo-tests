import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { RoutingService } from '@synergia-frontend/services';
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
  public readonly section = signal<HomeSection>('access');

  public goToTenant() {
    const identifier = this.connector.getIdentifier();
    if (identifier != null) {
      this.routingService.goToLogin(identifier);
    }
  }
}
