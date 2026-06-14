import { Component, Input } from '@angular/core';
import { IProjectModel } from '@synergia-frontend/interfaces';
import { SafeImageComponent } from '@synergia-frontend/components';

@Component({
  selector: 'app-view-project-details',
  templateUrl: './view-project-details.component.html',
  styleUrl: `./view-project-details.component.scss`,
  imports: [SafeImageComponent],
})
export class ViewProjectDetailsComponent {
  @Input() public project$!: IProjectModel;
}
