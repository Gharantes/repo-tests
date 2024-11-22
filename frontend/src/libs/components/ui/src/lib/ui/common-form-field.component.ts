import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'lib-sy-common-form-field',
  standalone: true,
  template: `
    <ng-container *ngIf="control">
      <mat-form-field [appearance]="'outline'" class="sy-common-form-field">
        <mat-icon *ngIf="icon && prefix" matPrefix>{{ icon }}</mat-icon>
        <mat-label>{{ label }}</mat-label>
        <input matInput type="text" [formControl]="control" />
        <mat-icon *ngIf="icon && (suffix || !prefix)" matSuffix>{{ icon }}</mat-icon>
      </mat-form-field>
    </ng-container>
  `,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    FaIconComponent,
    MatSuffix,
    MatPrefix,
    MatIcon,
  ],
  styles: [
    `
      :host {
        width: 100%;
        height: min-content;
      }
      .sy-common-form-field {
        width: 100%;
      }
    `,
  ],
})
export class CommonFormFieldComponent<T> {
  @Input() control?: FormControl<T>;
  @Input() label?: string;
  @Input() icon?: string;
  @Input() prefix?: boolean;
  @Input() suffix?: boolean;
}