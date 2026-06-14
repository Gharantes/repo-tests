import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-dashboard',
  standalone: true,
  templateUrl: 'view-dashboard.component.html',
  styleUrl: `view-dashboard.component.scss`,
  imports: [MatIconModule],
})
export class ViewDashboardComponent {
  @Output() createProjectEvent = new EventEmitter<void>();
  @Output() createEventEvent = new EventEmitter<void>();
}
