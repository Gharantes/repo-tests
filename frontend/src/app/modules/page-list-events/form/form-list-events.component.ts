import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatLabel } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { ConnectorListEvents } from '../connector/connector-list-events';
import { AddTagBtnComponent } from '@synergia-frontend/components';
import { MatChip, MatChipSet, MatChipsModule } from '@angular/material/chips';
import { ITagModel } from '@synergia-frontend/interfaces';

@Component({
  selector: 'app-form-list-events',
  templateUrl: './form-list-events.component.html',
  styleUrl: './form-list-events.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormField,
    MatPrefix,
    MatInput,
    FormsModule,
    MatLabel,
    ReactiveFormsModule,
    AddTagBtnComponent,
    MatChipSet,
    MatChip,
    MatChipsModule,
  ],
})
export class FormListEventsComponent {
  @Input() connector!: ConnectorListEvents;

  protected saveTag($event: ITagModel) {
    const control = this.connector.form.controls.tags;
    if (control.value.some((v) => v.id === $event.id)) return;
    control.setValue([...control.value, $event]);
  }

  protected removeTag(tag: ITagModel) {
    const control = this.connector.form.controls.tags;
    control.setValue(control.value.filter((v) => v.id !== tag.id));
  }
}