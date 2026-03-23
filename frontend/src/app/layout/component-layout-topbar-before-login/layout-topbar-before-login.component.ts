import { Component } from '@angular/core';
import { RoutingService, SessionService } from '@synergia-frontend/services';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-layout-topbar-before-login',
  standalone: true,
  templateUrl: './layout-topbar-before-login.component.html',
  styleUrl: `./layout-topbar-before-login.component.scss`,
  imports: [MatMenuModule],
})
export class LayoutTopbarBeforeLoginComponent {
  constructor(
    public readonly routingService: RoutingService,
    public readonly sessionService: SessionService
  ) {}

  public logout() {
    this.sessionService.logout();
    this.routingService.goToLogin();
  }
}