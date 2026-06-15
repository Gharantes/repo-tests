import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ConnectorUpsertAccont } from '../connector/connector-upsert-accont';
import { AddTagBtnComponent } from '@synergia-frontend/components';
import { MatChip, MatChipSet, MatChipsModule } from '@angular/material/chips';
import { ITagModel } from '@synergia-frontend/interfaces';

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
    AddTagBtnComponent,
    MatChipSet,
    MatChip,
    MatChipsModule,
  ],
})
export class FormUpsertAccountComponent {
  @Input() connector!: ConnectorUpsertAccont;

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
