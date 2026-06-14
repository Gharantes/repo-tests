import { Component } from "@angular/core";
import { MatRippleModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { RoutingService, SessionService } from "@synergia-frontend/services";

@Component({
  selector: 'app-layout-sidebar',
  standalone: true,
  templateUrl: './layout-sidebar.component.html',
  styleUrl: `./layout-sidebar.component.scss`,
  imports: [MatRippleModule, MatIconModule]
})
export class LayoutSidebarComponent {
  public exploreOpen = true;
  public yourProjectsOpen = false;
  public yourEventsOpen = false;

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
}
