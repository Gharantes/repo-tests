import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IUpsertEventModel } from '@synergia-frontend/interfaces';
import { ConnectorUpsertEvent } from '../connector/connector-upsert-event';

@Component({
  selector: 'app-view-upsert-event',
  templateUrl: './view-upsert-event.component.html',
  styleUrl: './view-upsert-event.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class ViewUpsertEventComponent {
  @Output() goToParentPageEvent = new EventEmitter<void>();
  @Output() salvarEvent = new EventEmitter<void>();
  @Input() public connector!: ConnectorUpsertEvent;
}
