import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { IAccountModel, ITagModel } from '@synergia-frontend/interfaces';
import { AddTagBtnComponent } from '@synergia-frontend/components';
import { ConnectorListAccounts } from '../connector/connector-list-accounts';

/** Cores derivadas do ID, para cada usuário/tag ter uma identidade visual estável. */
const PALETTE = ['#3B52CC', '#FF7043', '#16A34A', '#9333EA', '#0891B2', '#DB2777', '#CA8A04', '#4F46E5'];

@Component({
  selector: 'app-view-list-accounts',
  standalone: true,
  templateUrl: './view-list-accounts.component.html',
  styleUrl: './view-list-accounts.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule, MatMenuModule, AddTagBtnComponent],
})
export class ViewListAccountsComponent {
  @Input() data$!: IAccountModel[];
  @Input() connector!: ConnectorListAccounts;

  @Output() public readonly createAccountEvent = new EventEmitter<void>();
  @Output() public readonly editAccountEvent = new EventEmitter<IAccountModel>();
  @Output() public readonly deleteAccountEvent = new EventEmitter<IAccountModel>();

  public fullName(a: IAccountModel): string {
    const name = `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim();
    return name || a.login;
  }

  public initials(a: IAccountModel): string {
    const first = a.firstName?.trim()?.[0] ?? a.login?.[0] ?? '?';
    const last = a.lastName?.trim()?.[0] ?? '';
    return (first + last).toUpperCase();
  }

  public colorFor(id: number): string {
    return PALETTE[Math.abs(id) % PALETTE.length];
  }

  public get activeTags(): ITagModel[] {
    return this.connector.form.controls.tags.value;
  }

  public get hasFilters(): boolean {
    return !!this.connector.form.controls.text.value || this.activeTags.length > 0;
  }

  public addTagFilter(tag: ITagModel) {
    const control = this.connector.form.controls.tags;
    if (control.value.some((v) => v.id === tag.id)) return;
    control.setValue([...control.value, tag]);
  }

  public removeTagFilter(tag: ITagModel) {
    const control = this.connector.form.controls.tags;
    control.setValue(control.value.filter((v) => v.id !== tag.id));
  }

  public clearSearch() {
    this.connector.form.controls.text.setValue('');
  }

  public clearFilters() {
    this.connector.form.setValue({ text: '', tags: [] });
  }
}
