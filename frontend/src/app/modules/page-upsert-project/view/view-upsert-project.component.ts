import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ConnectorUpsertProject } from '../connector/connector-upsert-project';
import { FormUpsertProjectComponent } from '../form/form-upsert-project.component';

@Component({
  selector: 'app-view-upsert-project',
  standalone: true,
  templateUrl: './view-upsert-project.component.html',
  styleUrl: `./view-upsert-project.component.scss`,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    FormUpsertProjectComponent,
  ],
})
export class ViewUpsertProjectComponent {
  @Output() public readonly goToParentPageEvent = new EventEmitter<void>();
  @Output() public readonly saveEvent = new EventEmitter<void>();
  @Input() public connector!: ConnectorUpsertProject;
}