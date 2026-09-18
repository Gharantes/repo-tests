import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IEventModel, IProjectModel } from '@synergia-frontend/interfaces';
import { EventCardGridComponent, ProjectCardGridComponent } from '@synergia-frontend/components';

@Component({
  selector: 'app-view-dashboard',
  standalone: true,
  templateUrl: 'view-dashboard.component.html',
  styleUrl: `view-dashboard.component.scss`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIconModule, ProjectCardGridComponent, EventCardGridComponent],
})
export class ViewDashboardComponent {
  @Input() projects$: IProjectModel[] = [];
  @Input() events$: IEventModel[] = [];

  @Output() createProjectEvent = new EventEmitter<void>();
  @Output() createEventEvent = new EventEmitter<void>();
  @Output() openProjectEvent = new EventEmitter<IProjectModel>();
  @Output() openEventEvent = new EventEmitter<IEventModel>();
}
