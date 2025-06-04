import { Component } from "@angular/core";
import { MatRippleModule } from "@angular/material/core";
import { RoutingService, SessionService } from "@synergia-frontend/services";

@Component({
  selector: 'app-layout-sidebar',
  standalone: true,
  template: `
    <div class="routes-container">
      @for (item of routingService.getRouteLabels(); track $index) {
        <div matRipple (click)="routingService.goTo(item)" class="link">
          {{ item.label }}
        </div>
      }
    </div>
  `,
  styleUrl: `./style.scss`,
  imports: [MatRippleModule]
})
export class LayoutSidebarComponent {
  constructor(
    public readonly routingService: RoutingService,
    public readonly sessionService: SessionService
  ) {}
  ;
}