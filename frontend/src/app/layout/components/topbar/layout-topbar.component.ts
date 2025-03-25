import { Component, inject } from "@angular/core";
import { RoutingService } from "@synergia-frontend/services";

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
  `,
  styleUrl: `./style.scss`,
  imports: [],
})
export class LayoutTopbarComponent {
  public readonly routingService = inject(RoutingService)
}