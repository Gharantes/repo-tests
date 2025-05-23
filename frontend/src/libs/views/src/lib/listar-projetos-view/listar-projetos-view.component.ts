import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SigExtendableTableComponent } from "@synergia-frontend/components";
import { IDoBasicProjectInfo, IDoExtendableTableActions, IDoExtendableTableColumnInfo } from '@synergia-frontend/interfaces';

@Component({
    selector: 'lib-listar-projetos-view',
    template: ` 
    <div class="btn-line">
      <button mat-raised-button (click)="toNewProjectsPage()">
        <span>Criar novo projeto</span>
        <mat-icon class="material-symbols-outlined">add</mat-icon>
      </button>
    </div>

    <lib-sig-extendable-table
      [data$]="data$" 
      [columns]="columns"
      [actions]="tableActions"
    ></lib-sig-extendable-table>
  `,
    styleUrl: 'style.scss',
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        SigExtendableTableComponent
    ]
})
export class ListarProjetosViewComponent {
  @Input() data$!: Signal<IDoBasicProjectInfo[]>;

  @Output() toNewProjectsPageEvent = new EventEmitter<void>();
  public toNewProjectsPage() { this.toNewProjectsPageEvent.emit(); }
  
  @Output() readonly editEntryEvent = new EventEmitter<IDoBasicProjectInfo>();
  @Output() readonly deleteEntryEvent = new EventEmitter<IDoBasicProjectInfo>();
  public editEntry(el: IDoBasicProjectInfo) { this.editEntryEvent.emit(el) }
  public deleteEntry(el: IDoBasicProjectInfo) { this.deleteEntryEvent.emit(el) }

  public readonly columns: IDoExtendableTableColumnInfo<IDoBasicProjectInfo>[] =[
    { def: 'title', header: 'Nome', 
      value: (element: IDoBasicProjectInfo) => { return element.title; },
    },
    { def: 'description', header: 'Descrição', 
      value: (element: IDoBasicProjectInfo) => { return element.description; },
    },
  ]

  public readonly tableActions: IDoExtendableTableActions<IDoBasicProjectInfo>[] = [
    { 
      label: 'Editar Projeto',
      icon: '', 
      action: (el: IDoBasicProjectInfo) => { this.editEntry.bind(this)(el) },
      isAllowed: () => { return true; }
    },
    { 
      label: 'Deletar Projeto',
      icon: '', 
      action: (el: IDoBasicProjectInfo) => { this.deleteEntry.bind(this)(el) },
      isAllowed: () => { return true; }
    },
  ]
}
