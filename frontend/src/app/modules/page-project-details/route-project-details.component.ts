import { Component, signal } from '@angular/core';
import { ViewProjectDetailsComponent } from './view/view-project-details.component';
import { IEventModel } from '@synergia-frontend/interfaces';

@Component({
  selector: 'app-route-project-details',
  templateUrl: './route-project-details.component.html',
  styleUrl: `./route-project-details.component.scss`,
  imports: [ViewProjectDetailsComponent],
})
export class RouteProjectDetailsComponent {
  public readonly events$ = signal<IEventModel[]>([]);
}