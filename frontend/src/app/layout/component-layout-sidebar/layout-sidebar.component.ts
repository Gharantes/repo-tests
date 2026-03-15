import { Component } from "@angular/core";
import { MatRippleModule } from "@angular/material/core";
import { RoutingService, SessionService } from "@synergia-frontend/services";

@Component({
  selector: 'app-layout-sidebar',
  standalone: true,
  templateUrl: './layout-sidebar.component.html',
  styleUrl: `./layout-sidebar.component.scss`,
  imports: [MatRippleModule]
})
export class LayoutSidebarComponent {
  constructor(
    public readonly routingService: RoutingService,
    public readonly sessionService: SessionService
  ) {}

  public sidebarElements: { label: string, goTo: () => void }[] = []
}