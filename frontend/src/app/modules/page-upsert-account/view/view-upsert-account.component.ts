import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ConnectorUpsertAccont } from '../connector/connector-upsert-accont';
import { FormUpsertAccountComponent } from '../form/form-upsert-account.component';

@Component({
  selector: 'app-view-upsert-account',
  standalone: true,
  templateUrl: './view-upsert-account.component.html',
  styleUrl: './view-upsert-account.component.scss',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormUpsertAccountComponent,
  ],
})
export class ViewUpsertAccountComponent {
  @Output() goToParentRouteEvent = new EventEmitter<void>();
  @Output() saveEvent = new EventEmitter<void>();
  @Input() connector!: ConnectorUpsertAccont;
}
