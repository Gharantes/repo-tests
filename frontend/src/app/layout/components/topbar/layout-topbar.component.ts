import { Component, inject } from "@angular/core";
import { RoutingService } from "@synergia-frontend/services";
import { MatMenuModule } from '@angular/material/menu';
import { GmIconComponent } from "@synergia-frontend/components";

@Component({
  standalone: true,
  selector: 'app-layout-topbar',
  template: `
    <div>
      Synergia
    </div>

    <div>
      {{ routingService.activeRouteInfo()?.label ?? '' }}
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
  imports: [GmIconComponent, MatMenuModule],
})
export class LayoutTopbarComponent {
  public readonly routingService = inject(RoutingService);

  public logout() {
    this.routingService.goTo(this.routingService.login());
  }
}