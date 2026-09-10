import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-dashboard',
  standalone: true,
  templateUrl: 'view-dashboard.component.html',
  styleUrl: `view-dashboard.component.scss`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIconModule],
})
export class ViewDashboardComponent {
  @Output() createProjectEvent = new EventEmitter<void>();
  @Output() createEventEvent = new EventEmitter<void>();
}
