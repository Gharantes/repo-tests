import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IEventModel } from '@synergia-frontend/interfaces';
import { SafeImageComponent } from '../../safe-image/safe-image.component';

@Component({
  selector: 'lib-project-card-grid-entry',
  templateUrl: `project-card-grid-entry.component.html`,
  styleUrl: 'project-card-grid-entry.component.scss',
  imports: [CommonModule, SafeImageComponent],
  standalone: true,
})
export class ProjectCardGridEntryComponent {
  @Input() public entry!: IEventModel;
  @Output() public cardInteractionEvent = new EventEmitter<IEventModel>();
}