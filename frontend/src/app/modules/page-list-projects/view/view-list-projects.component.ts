import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SigExtendableTableComponent } from '@synergia-frontend/components';
import {
  IDoExtendableTableActions,
  IDoExtendableTableColumnInfo,
  IProjectModel,
} from '@synergia-frontend/interfaces';

@Component({
  selector: 'app-view-list-projects',
  standalone: true,
  templateUrl: './view-list-projects.component.html',
  styleUrl: 'view-list-projects.component.scss',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    SigExtendableTableComponent
  ]
})
export class ViewListProjectsComponent {
  @Input() data$!: IProjectModel[];

  @Output() readonly createProjectEvent = new EventEmitter<void>();
  @Output() readonly editProjectEvent = new EventEmitter<IProjectModel>();
  @Output() readonly deleteProjectEvent = new EventEmitter<IProjectModel>();
  @Output() readonly toProjectPageEvent = new EventEmitter<IProjectModel>();

  public readonly columns: IDoExtendableTableColumnInfo<IProjectModel>[] =[
    { def: 'title', header: 'Nome', value: (element: IProjectModel) => element.title },
    { def: 'description', header: 'Descrição', value: (element: IProjectModel) => element.description },
  ]

  public readonly tableActions: IDoExtendableTableActions<IProjectModel>[] = [
    { 
      label: 'Editar Projeto',
      icon: '', 
      action: (el: IProjectModel) => this.editProjectEvent.emit(el),
      isAllowed: () => true
    },
    { 
      label: 'Deletar Projeto',
      icon: '', 
      action: (el: IProjectModel) => this.deleteProjectEvent.emit(el),
      isAllowed: () => true
    },
    {
      label: 'Página do Projeto',
      icon: '',
      action: (el: IProjectModel) => this.toProjectPageEvent.emit(el),
      isAllowed: () => true
    }
  ]
}
