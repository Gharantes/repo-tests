import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'sy-common-form-field',
  standalone: true,
  template: `
    <mat-form-field [appearance]="'outline'">
      <mat-label>{{ label }}</mat-label>
      <input matInput type="text" [formControl]="formControl" />
    </mat-form-field>
  `,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel
  ],
  styles: [`
  `]
})
export class CommonFormFieldComponent<T> {
  @Input() formControl!: FormControl<T>;
  @Input() label?: string;
}