import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ConnectorUpsertAccont } from '../connector/connector-upsert-accont';

@Component({
  selector: 'app-form-upsert-account',
  standalone: true,
  templateUrl: './form-upsert-account.component.html',
  styleUrl: './form-upsert-account.component.scss',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
})
export class FormUpsertAccountComponent {
  @Input() connector!: ConnectorUpsertAccont;
}
