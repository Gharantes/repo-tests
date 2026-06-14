import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IEventModel, ITagModel } from '@synergia-frontend/interfaces';
import { AddPostBtnComponent, AddTagBtnComponent, SafeImageComponent } from '@synergia-frontend/components';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-event-details',
  templateUrl: './view-event-details.component.html',
  styleUrl: `./view-event-details.component.scss`,
  imports: [
    SafeImageComponent,
    AddTagBtnComponent,
    MatChip,
    MatChipSet,
    MatIconModule,
    AddPostBtnComponent,
  ],
})
export class ViewEventDetailsComponent {
  @Input() public event$!: IEventModel;
  @Output() addNewPostEvent = new EventEmitter<void>();
  @Output() removeTagEvent = new EventEmitter<ITagModel>();
  @Output() saveTagEvent = new EventEmitter<ITagModel>();
  @Output() savePostEvent = new EventEmitter<ITagModel>();
}