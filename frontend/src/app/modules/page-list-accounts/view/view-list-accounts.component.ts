import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import {
  IAccount,
  IDoExtendableTableActions,
  IDoExtendableTableColumnInfo,
} from '@synergia-frontend/interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SigExtendableTableComponent } from '@synergia-frontend/components';

@Component({
  selector: 'app-view-list-accounts',
  standalone: true,
  templateUrl: './view-list-accounts.component.html',
  styleUrl: 'view-list-accounts.component.scss',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    SigExtendableTableComponent,
  ],
})
export class ViewListAccountsComponent {
  @Input() data$!: Signal<IAccount[]>;

  @Output() public readonly createAccountEvent = new EventEmitter<void>();
  @Output() public readonly editAccountEvent = new EventEmitter<IAccount>();
  @Output() public readonly deleteAccountEvent = new EventEmitter<IAccount>();

  public readonly columns: IDoExtendableTableColumnInfo<IAccount>[] = [
    {
      def: 'id',
      header: 'ID',
      value: (element: IAccount) => element.id,
    },
    {
      def: 'login',
      header: 'Login',
      value: (element: IAccount) => element.login
    },
    {
      def: 'name',
      header: 'Nome',
      value: (element: IAccount) => (element.firstName ?? '') + ' ' + (element.lastName ?? ''),
    },
  ];

  public readonly tableActions: IDoExtendableTableActions<IAccount>[] = [
    {
      label: 'Deletar Usuário',
      icon: '',
      action: (el: IAccount) => this.deleteAccountEvent.emit(el),
      isAllowed: () => true,
    },
    {
      label: 'Editar Usuário',
      icon: '',
      action: (el: IAccount) => this.editAccountEvent.emit(el),
      isAllowed: () => true
    },
  ];
}
