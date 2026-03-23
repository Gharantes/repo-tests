import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ConnectorUpsertEvent } from '../connector/connector-upsert-event';

@Component({
  selector: 'app-form-upsert-event',
  templateUrl: './form-upsert-event.component.html',
  styleUrl: './form-upsert-event.component.scss',
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
export class FormUpsertEventComponent {
  @Input() public connector!: ConnectorUpsertEvent;
}
