
import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ConnectorUpsertEvent } from '../connector/connector-upsert-event';
import { FormUpsertEventComponent } from '../form/form-upsert-event.component';

@Component({
  selector: 'app-view-upsert-event',
  templateUrl: './view-upsert-event.component.html',
  styleUrl: './view-upsert-event.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormUpsertEventComponent
],
})
export class ViewUpsertEventComponent {
  @Output() goToParentPageEvent = new EventEmitter<void>();
  @Output() salvarEvent = new EventEmitter<void>();
  @Input() public connector!: ConnectorUpsertEvent;
}
