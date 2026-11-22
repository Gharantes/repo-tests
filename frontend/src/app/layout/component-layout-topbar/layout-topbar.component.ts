import { Component, ChangeDetectionStrategy, computed, inject } from '@angular/core';
import { JoinRequestService, NotificationService, RoutingService, SessionService } from '@synergia-frontend/services';
import { activityIcon, activityVerb, formatRelativeTime } from '@synergia-frontend/utils';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-layout-topbar',
  standalone: true,
  templateUrl: './layout-topbar.component.html',
  styleUrl: `./layout-topbar.component.scss`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatMenuModule, MatIconModule, MatButtonModule, MatBadgeModule]
})
export class LayoutTopbarComponent {
  public readonly notifications = inject(NotificationService);
  public readonly joinRequests = inject(JoinRequestService);
  public readonly iconFor = activityIcon;
  public readonly verbFor = activityVerb;
  public readonly relative = (value: string) => formatRelativeTime(value);
  public readonly badgeText = computed(() => {
    const n = this.notifications.unread();
    return n > 99 ? '99+' : String(n);
  });

  constructor(
    public readonly routingService: RoutingService,
    public readonly sessionService: SessionService
  ) {
    this.notifications.startPolling();
  }

  public getInitials(): string {
    const label = this.sessionService.getUserLabel() ?? '';
    const parts = label.trim().split(/\s+/).filter(p => p.length > 0);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return 'GA';
  }

  public logout() {
    const identifier = this.sessionService.getTenantIdentifier();
    this.notifications.reset();
    this.sessionService.logout();
    this.routingService.goToLogin(identifier);
  }
}
