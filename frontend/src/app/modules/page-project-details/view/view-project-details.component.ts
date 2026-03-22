import { Component, Input } from '@angular/core';
import { IEventModel } from '@synergia-frontend/interfaces';

@Component({
  selector: 'app-view-project-details',
  templateUrl: './view-project-details.component.html',
  styleUrl: `./view-project-details.component.scss`,
})
export class ViewProjectDetailsComponent {
  @Input() public projects$!: IEventModel[];
}