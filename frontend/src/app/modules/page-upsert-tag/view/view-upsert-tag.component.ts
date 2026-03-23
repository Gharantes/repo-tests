import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { FormUpsertTagComponent } from '../form/form-upsert-tag.component';
import { ConnectorUpsertTag } from '../connector/connector-upsert-tag';

@Component({
  selector: 'app-view-upsert-tag',
  standalone: true,
  templateUrl: './view-upsert-tag.component.html',
  styleUrl: `./view-upsert-tag.component.scss`,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    FormUpsertTagComponent,
  ],
  providers: [],
})
export class ViewUpsertTagComponent {
  @Output() readonly goToParentPageEvent = new EventEmitter<void>();
  @Output() readonly saveEvent = new EventEmitter<void>();

  @Input() connector!: ConnectorUpsertTag;
}