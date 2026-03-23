import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatLabel } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { ConnectorListEvents } from '../connector/connector-list-events';

@Component({
  selector: 'app-form-list-events',
  templateUrl: './form-list-events.component.html',
  styleUrl: './form-list-events.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormField,
    MatInput,
    FormsModule,
    MatLabel,
    ReactiveFormsModule,
  ],
})
export class FormListEventsComponent {
  @Input() connector!: ConnectorListEvents;
}