import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ConnectorUpsertEvent } from '../connector/connector-upsert-event';
import { AddTagBtnComponent } from '@synergia-frontend/components';
import { ITagModel } from '@synergia-frontend/interfaces';
import { MatChip, MatChipSet, MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-form-upsert-event',
  templateUrl: './form-upsert-event.component.html',
  styleUrl: './form-upsert-event.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    AddTagBtnComponent,
    MatChipSet,
    MatChip,
    MatChipsModule,
  ],
})
export class FormUpsertEventComponent {
  @Input() public connector!: ConnectorUpsertEvent;

  protected saveTag($event: ITagModel) {
    const tagsControl = this.connector.form.controls.tags;
    const current = tagsControl.value;
    if (current.filter((v) => (v.id = $event.id)).length > 0) {
      return;
    }
    current.push($event);
  }
  protected removeTag(tag: ITagModel) {
    const tagsControl = this.connector.form.controls.tags;
    const current = tagsControl.value;
    const index = current.findIndex((v) => v.id == tag.id);
    if (index == -1) {
      return;
    }
    current.splice(index, 1);
  }
}
