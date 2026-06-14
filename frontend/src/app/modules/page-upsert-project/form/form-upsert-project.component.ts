import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ITagModel } from '@synergia-frontend/interfaces';
import { ConnectorUpsertProject } from '../connector/connector-upsert-project';
import { AddTagBtnComponent } from '@synergia-frontend/components';
import { MatChip, MatChipSet, MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-form-upsert-project',
  standalone: true,
  templateUrl: './form-upsert-project.component.html',
  styleUrl: `./form-upsert-project.component.scss`,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    AddTagBtnComponent,
    MatChipSet,
    MatChip,
    MatChipsModule,
  ],
})
export class FormUpsertProjectComponent {
  @Output() public readonly goToParentPageEvent = new EventEmitter<void>();
  @Output() public readonly saveEvent = new EventEmitter<void>();
  @Input() public connector!: ConnectorUpsertProject;

  protected saveTag($event: ITagModel) {
    const tagsControl = this.connector.form.controls.tags;
    const current = tagsControl.value;
    if (current.filter((v) => v.id === $event.id).length > 0) {
      return;
    }
    current.push($event);
  }

  protected removeTag(tag: ITagModel) {
    const tagsControl = this.connector.form.controls.tags;
    const current = tagsControl.value;
    const index = current.findIndex((v) => v.id === tag.id);
    if (index === -1) {
      return;
    }
    current.splice(index, 1);
  }
}