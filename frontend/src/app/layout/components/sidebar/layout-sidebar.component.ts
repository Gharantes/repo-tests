import { Component, inject } from "@angular/core";
import { RoutingService, SessionService } from "@synergia-frontend/services";

@Component({
  standalone: true,
  selector: 'app-layout-sidebar',
  template: `
    <div class="routes-container">
      @for (item of routingService.routeLabelsConst; track $index) {
        <div (click)="routingService.goTo(item)">
          {{ item.label }}
        </div>
      }
    </div>
  `,
  styleUrl: `./style.scss`,
  imports: [],
})
export class LayoutSidebarComponent {
  public readonly routingService = inject(RoutingService);
  public readonly sessionService = inject(SessionService);
}