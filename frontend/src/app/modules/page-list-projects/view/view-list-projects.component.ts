import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SigExtendableTableComponent } from '@synergia-frontend/components';
import {
  IDoExtendableTableActions,
  IDoExtendableTableColumnInfo,
  IProject,
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
  @Input() data$!: IProject[];

  @Output() readonly createProjectEvent = new EventEmitter<void>();
  @Output() readonly editProjectEvent = new EventEmitter<IProject>();
  @Output() readonly deleteProjectEvent = new EventEmitter<IProject>();
  @Output() readonly toProjectPageEvent = new EventEmitter<IProject>();

  public readonly columns: IDoExtendableTableColumnInfo<IProject>[] =[
    { def: 'title', header: 'Nome', value: (element: IProject) => element.title },
    { def: 'description', header: 'Descrição', value: (element: IProject) => element.description },
  ]

  public readonly tableActions: IDoExtendableTableActions<IProject>[] = [
    { 
      label: 'Editar Projeto',
      icon: '', 
      action: (el: IProject) => this.editProjectEvent.emit(el),
      isAllowed: () => true
    },
    { 
      label: 'Deletar Projeto',
      icon: '', 
      action: (el: IProject) => this.deleteProjectEvent.emit(el),
      isAllowed: () => true
    },
    {
      label: 'Página do Projeto',
      icon: '',
      action: (el: IProject) => this.toProjectPageEvent.emit(el),
      isAllowed: () => true
    }
  ]
}
