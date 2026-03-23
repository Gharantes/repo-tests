import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SigExtendableTableComponent } from '@synergia-frontend/components';
import {
  IDoExtendableTableActions,
  IDoExtendableTableColumnInfo,
  ITagModel,
} from '@synergia-frontend/interfaces';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { ConnectorListTags } from '../connector/connector-list-tags';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-view-list-tags',
  standalone: true,
  templateUrl: './view-list-tags.component.html',
  styleUrl: `./view-list-tags.component.scss`,
  imports: [
    SigExtendableTableComponent,
    MatInput,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule
  ],
})
export class ViewListTagsComponent {
  @Input() public data$!: ITagModel[];
  @Input() public connector!: ConnectorListTags;

  @Output() public readonly createTagEvent = new EventEmitter<void>();
  @Output() public readonly deleteTagEvent = new EventEmitter<ITagModel>();
  @Output() public readonly editTagEvent = new EventEmitter<ITagModel>();

  public readonly columns: IDoExtendableTableColumnInfo<ITagModel>[] = [
    { def: 'id', header: 'ID', value: (el) => el.id },
    { def: 'name', header: 'Nome', value: (el) => el.title },
    { def: 'for_projects', header: 'Disponível para Projetos', value: (el) => el.forProjects, special: 'BOOLEAN' },
    { def: 'for_events', header: 'Disponível para Eventos', value: (el) => el.forEvents, special: 'BOOLEAN' },
    { def: 'for_accounts', header: 'Disponível para Usuários', value: (el) => el.forAccounts, special: 'BOOLEAN' },
  ];
  public readonly actions: IDoExtendableTableActions<ITagModel>[] = [
    { label: 'Editar', action: (el) => this.editTagEvent.emit(el), icon: '', isAllowed: () => true },
    { label: 'Deletar', action: (el) => this.deleteTagEvent.emit(el), icon: '', isAllowed: () => true }
  ];
}