import { Component } from '@angular/core';
import { RoutingService, SessionService } from '@synergia-frontend/services';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-layout-topbar',
  standalone: true,
  templateUrl: './layout-topbar.component.html',
  styleUrl: `./layout-topbar.component.scss`,
  imports: [MatMenuModule, MatIconModule, MatButtonModule]
})
export class LayoutTopbarComponent {
  constructor(
    public readonly routingService: RoutingService,
    public readonly sessionService: SessionService
  ) {}

  public getInitials(): string {
    const label = this.sessionService.getUserLabel() ?? '';
    const parts = label.trim().split(/\s+/).filter(p => p.length > 0);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return 'GA';
  }

  public logout() {
    this.sessionService.logout();
    this.routingService.goToLogin();
  }
}
