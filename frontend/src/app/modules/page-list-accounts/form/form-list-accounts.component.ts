import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatLabel } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { ConnectorListAccounts } from '../connector/connector-list-accounts';
import { AddTagBtnComponent } from '@synergia-frontend/components';
import { MatChip, MatChipSet, MatChipsModule } from '@angular/material/chips';
import { ITagModel } from '@synergia-frontend/interfaces';

@Component({
  selector: 'app-form-list-accounts',
  templateUrl: './form-list-accounts.component.html',
  styleUrl: './form-list-accounts.component.scss',
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
export class FormListAccountsComponent {
  @Input() connector!: ConnectorListAccounts;

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
