import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { IProjectModel, ITagModel } from '@synergia-frontend/interfaces';
import { SafeImageComponent } from '@synergia-frontend/components';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-project-details',
  templateUrl: './view-project-details.component.html',
  styleUrl: `./view-project-details.component.scss`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SafeImageComponent, MatChip, MatChipSet, MatIconModule],
})
export class ViewProjectDetailsComponent {
  @Input() public project$!: IProjectModel;
  @Output() removeTagEvent = new EventEmitter<ITagModel>();
  @Output() saveTagEvent = new EventEmitter<ITagModel>();
}
