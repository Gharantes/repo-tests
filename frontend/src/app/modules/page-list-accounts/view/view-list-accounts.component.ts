import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import {
  IAccountModel,
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
  @Input() data$!: Signal<IAccountModel[]>;

  @Output() public readonly createAccountEvent = new EventEmitter<void>();
  @Output() public readonly editAccountEvent = new EventEmitter<IAccountModel>();
  @Output() public readonly deleteAccountEvent = new EventEmitter<IAccountModel>();

  public readonly columns: IDoExtendableTableColumnInfo<IAccountModel>[] = [
    {
      def: 'id',
      header: 'ID',
      value: (element: IAccountModel) => element.id,
    },
    {
      def: 'login',
      header: 'Login',
      value: (element: IAccountModel) => element.login
    },
    {
      def: 'name',
      header: 'Nome',
      value: (element: IAccountModel) => (element.firstName ?? '') + ' ' + (element.lastName ?? ''),
    },
  ];

  public readonly tableActions: IDoExtendableTableActions<IAccountModel>[] = [
    {
      label: 'Deletar Usuário',
      icon: '',
      action: (el: IAccountModel) => this.deleteAccountEvent.emit(el),
      isAllowed: () => true,
    },
    {
      label: 'Editar Usuário',
      icon: '',
      action: (el: IAccountModel) => this.editAccountEvent.emit(el),
      isAllowed: () => true
    },
  ];
}
