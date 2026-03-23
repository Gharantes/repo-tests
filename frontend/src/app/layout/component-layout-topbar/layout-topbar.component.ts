import { Component } from '@angular/core';
import { RoutingService, SessionService } from '@synergia-frontend/services';
import { MatMenuModule } from '@angular/material/menu';
import { GmIconComponent } from '@synergia-frontend/components';

@Component({
  selector: 'app-layout-topbar',
  standalone: true,
  templateUrl: './layout-topbar.component.html',
  styleUrl: `./layout-topbar.component.scss`,
  imports: [GmIconComponent, MatMenuModule]
})
export class LayoutTopbarComponent {
  constructor(
    public readonly routingService: RoutingService, 
    public readonly sessionService: SessionService
  ) {}

  public logout() {
    this.sessionService.logout();
    this.routingService.goToLogin();
  }
}