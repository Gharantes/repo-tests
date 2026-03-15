import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatLabel } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { ConnectorListEvents } from '../connector/connector-list-events';

@Component({
  selector: 'app-header-list-events',
  templateUrl: './header-list-events.component.html',
  styleUrl: './header-list-events.component.scss',
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
export class HeaderListEventsComponent {
  @Input() connector!: ConnectorListEvents;
  @Output() lookupEvent = new EventEmitter<void>();
}