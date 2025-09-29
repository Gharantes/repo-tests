import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
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
import { debounceTime, tap } from 'rxjs';

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
    textfield: FormControl<string | undefined>;
  }>;
  @Output() updateFiltrosEvent = new EventEmitter<Partial<{ textfield: string|undefined }>>();

  constructor(private readonly fb: NonNullableFormBuilder) {
    this.form = this.instanceForm();

    this.form.valueChanges.pipe(
      debounceTime(700),
      tap(res => this.updateFiltrosEvent.emit(res))
    ).subscribe()
  }

  private instanceForm() {
    return this.fb.group({
      textfield: this.fb.control<string | undefined>(undefined, []),
    });
  }
}