import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IEventModel, IProjectModel } from '@synergia-frontend/interfaces';
import { EventCardGridComponent, ProjectCardGridComponent } from '@synergia-frontend/components';

@Component({
  selector: 'app-view-dashboard',
  standalone: true,
  templateUrl: 'view-dashboard.component.html',
  styleUrl: `view-dashboard.component.scss`,
  imports: [ProjectCardGridComponent, EventCardGridComponent],
})
export class ViewDashboardComponent {
  @Input() public projects$!: IProjectModel[];
  @Input() public events$!: IEventModel[];

  @Output() projectCardInteractionEvent = new EventEmitter<IProjectModel>();
  @Output() eventCardInteractionEvent = new EventEmitter<IEventModel>();
}