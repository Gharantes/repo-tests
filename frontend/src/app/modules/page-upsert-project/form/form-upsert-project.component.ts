import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ITagModel } from '@synergia-frontend/interfaces';
import { ConnectorUpsertProject } from '../connector/connector-upsert-project';

@Component({
  selector: 'app-form-upsert-project',
  standalone: true,
  templateUrl: './form-upsert-project.component.html',
  styleUrl: `./form-upsert-project.component.scss`,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
})
export class FormUpsertProjectComponent {
  @Output() public readonly goToParentPageEvent = new EventEmitter<void>();
  @Output() public readonly saveEvent = new EventEmitter<void>();
  @Input() public connector!: ConnectorUpsertProject;
  @Input() public tags!: ITagModel[];
}