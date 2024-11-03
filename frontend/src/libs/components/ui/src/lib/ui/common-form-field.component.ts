import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';

@Component({
  selector: 'sy-common-form-field',
  standalone: true,
  template: `
    <ng-container *ngIf="control">
      <mat-form-field [appearance]="'outline'">
        <mat-label>{{ label }}</mat-label>
        <input matInput type="text" [formControl]="control" />
      </mat-form-field>
    </ng-container>
  `,
  imports: [ReactiveFormsModule, MatFormField, MatInput, MatLabel, NgIf],
  styles: [``],
})
export class CommonFormFieldComponent<T> {
  @Input() control?: FormControl<T>;
  @Input() label?: string;
}