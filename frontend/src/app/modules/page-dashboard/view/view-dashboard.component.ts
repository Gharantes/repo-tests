import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IEventModel, IFeedItemModel, IProjectModel } from '@synergia-frontend/interfaces';
import { EventCardGridComponent, ProjectCardGridComponent } from '@synergia-frontend/components';
import { AuthPermission, PermissionService } from '@synergia-frontend/services';
import { DashboardFeedComponent } from '../feed/dashboard-feed.component';

@Component({
  selector: 'app-view-dashboard',
  standalone: true,
  templateUrl: 'view-dashboard.component.html',
  styleUrl: `view-dashboard.component.scss`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIconModule, ProjectCardGridComponent, EventCardGridComponent, DashboardFeedComponent],
})
export class ViewDashboardComponent {
  @Input() projects$: IProjectModel[] = [];
  @Input() events$: IEventModel[] = [];
  @Input() feed$: IFeedItemModel[] = [];
  @Input() feedLoaded = false;
  public readonly permissions = inject(PermissionService);
  public readonly P = AuthPermission;

  @Output() createProjectEvent = new EventEmitter<void>();
  @Output() createEventEvent = new EventEmitter<void>();
  @Output() openProjectEvent = new EventEmitter<IProjectModel>();
  @Output() openEventEvent = new EventEmitter<IEventModel>();
  @Output() openFeedItemEvent = new EventEmitter<IFeedItemModel>();
}
