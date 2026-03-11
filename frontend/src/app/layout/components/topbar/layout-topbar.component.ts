import { Component, inject } from "@angular/core";
import { RoutingService, SessionService } from "@synergia-frontend/services";
import { MatMenuModule } from '@angular/material/menu';
import { GmIconComponent } from "@synergia-frontend/components";

@Component({
  selector: 'app-layout-topbar',
  standalone: true,
  template: `
    <div>
      Synergia
    </div>

    <div>
      {{ routingService.activeRouteInfo()?.label ?? '' }}
    </div>

    <div>
      {{ sessionService.getTenantId() }} - {{ sessionService.getTenantLabel() }}
    </div>
    <button 
      class="usr-btn" 
      [matMenuTriggerFor]="userMenu">
      <lib-gm-icon [type]="'rounded'" [image]="'account_circle'"></lib-gm-icon>
    </button>
    <mat-menu #userMenu="matMenu">
      <button mat-menu-item (click)="logout()">Logout</button>
    </mat-menu>
  `,
  styleUrl: `./style.scss`,
  imports: [GmIconComponent, MatMenuModule]
})
export class LayoutTopbarComponent {
  constructor(
    public readonly routingService: RoutingService, 
    public readonly sessionService: SessionService
  ) {}

  public logout() {
    this.sessionService.logout()
    this.routingService.goTo(this.routingService.goToLogin());
  }
}