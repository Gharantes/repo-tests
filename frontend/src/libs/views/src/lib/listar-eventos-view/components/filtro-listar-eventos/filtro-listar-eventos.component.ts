import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatLabel } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule
} from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';

@Component({
  selector: 'lib-filtro-page-listar-eventos',
  templateUrl: 'index.html',
  styleUrl: 'style.scss',
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
export class FiltroListarEventosComponent {
  public readonly form: FormGroup<{
    textfield: FormControl<string | null>;
  }>;
  constructor(private readonly fb: NonNullableFormBuilder) {
    this.form = this.instanceForm();
  }

  private instanceForm() {
    return this.fb.group({
      textfield: this.fb.control<string | null>(null, []),
    });
  }
}