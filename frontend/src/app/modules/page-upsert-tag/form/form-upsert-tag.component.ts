import { Component, Input } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ConnectorUpsertTag } from '../connector/connector-upsert-tag';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-form-upsert-tag',
  standalone: true,
  templateUrl: './form-upsert-tag.component.html',
  styleUrl: `./form-upsert-tag.component.scss`,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatCheckbox
],
  providers: [],
})
export class FormUpsertTagComponent {
  @Input() connector!: ConnectorUpsertTag;
}