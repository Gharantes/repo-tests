import { Component } from '@angular/core';
import { ViewProjectDetailsComponent } from './view/view-project-details.component';

@Component({
  selector: 'app-route-project-details',
  templateUrl: './route-project-details.component.html',
  styleUrl: `./route-project-details.component.scss`,
  imports: [ViewProjectDetailsComponent],
})
export class RouteProjectDetailsComponent {}
