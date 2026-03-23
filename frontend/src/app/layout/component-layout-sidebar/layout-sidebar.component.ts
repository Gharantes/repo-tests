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

  public sidebarElements: { label: string, goTo: () => void }[] = [
    { label: 'Dashboard', goTo: () => this.routingService.goToDashboard() },
    { label: 'Explorar Projetos', goTo: () => this.routingService.goToListProjects() },
    { label: 'Explorar Eventos', goTo: () => this.routingService.goToListEvents() },
    { label: 'Visualizar Tags', goTo: () => this.routingService.goToListTags() },
    { label: 'Usuários', goTo: () => this.routingService.goToListAccounts() },
  ]
}