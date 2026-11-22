import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IEventModel, INotificationModel, IProjectModel } from '@synergia-frontend/interfaces';
import { EventCardGridComponent, ProjectCardGridComponent } from '@synergia-frontend/components';
import { AuthPermission, PermissionService } from '@synergia-frontend/services';
import { DashboardNotificationsComponent } from '../notifications/dashboard-notifications.component';

@Component({
  selector: 'app-view-dashboard',
  standalone: true,
  templateUrl: 'view-dashboard.component.html',
  styleUrl: `view-dashboard.component.scss`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIconModule, ProjectCardGridComponent, EventCardGridComponent, DashboardNotificationsComponent],
})
export class ViewDashboardComponent {
  @Input() projects$: IProjectModel[] = [];
  @Input() events$: IEventModel[] = [];
  @Input() notifications$: INotificationModel[] = [];
  @Input() notificationsLoaded = false;
  public readonly permissions = inject(PermissionService);
  public readonly P = AuthPermission;

  @Output() createProjectEvent = new EventEmitter<void>();
  @Output() createEventEvent = new EventEmitter<void>();
  @Output() openProjectEvent = new EventEmitter<IProjectModel>();
  @Output() openEventEvent = new EventEmitter<IEventModel>();
  @Output() openNotificationEvent = new EventEmitter<INotificationModel>();
  @Output() markReadEvent = new EventEmitter<INotificationModel>();
  @Output() markAllReadEvent = new EventEmitter<void>();
  @Output() acceptRequestEvent = new EventEmitter<INotificationModel>();
  @Output() declineRequestEvent = new EventEmitter<INotificationModel>();
}
