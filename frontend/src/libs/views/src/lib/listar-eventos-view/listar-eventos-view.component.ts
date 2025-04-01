import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SigExtendableTableComponent } from '@synergia-frontend/components';
import { IDoBasicEventInfo, IDoExtendableTableActions, IDoExtendableTableColumnInfo } from '@synergia-frontend/interfaces';

@Component({
  selector: 'lib-listar-eventos-view',
  standalone: true,
  template: ` 
    <div class="btn-line">
      <button mat-raised-button (click)="toNewEventPage()">
        <span>Criar novo evento</span>
        <mat-icon class="material-symbols-outlined">add</mat-icon>
      </button>
    </div>
    
    <lib-sig-extendable-table
      [data$]="data$" 
      [columns]="tableColumns"
      [actions]="tableActions"
    ></lib-sig-extendable-table>
  `,
  styleUrl: 'style.scss',
  imports: [
    CommonModule, 
    SigExtendableTableComponent, 
    MatIconModule,
    MatButtonModule
  ],
})
export class ListarEventosViewComponent {
  @Input() data$!: Signal<IDoBasicEventInfo[]>;
  
  @Output() toNewEventPageEvent = new EventEmitter<void>();
  public toNewEventPage() { return this.toNewEventPageEvent.emit() }

  @Output() editEntryEvent = new EventEmitter<IDoBasicEventInfo>();

  public readonly tableColumns: IDoExtendableTableColumnInfo<IDoBasicEventInfo>[] =[
    { def: 'title', header: 'Nome', 
      value: (element: IDoBasicEventInfo) => { return element.title; }
    },
    { def: 'description', header: 'Descrição', 
      value: (element: IDoBasicEventInfo) => { return element.description; }
    },
  ]
  public readonly tableActions: IDoExtendableTableActions<IDoBasicEventInfo>[] = [
    { 
      label: 'Editar Evento',
      icon: '', 
      action: (el: IDoBasicEventInfo) => { this.editEntryEvent.bind(this).emit(el) },
      isAllowed: () => { return true; }
    }
  ]


}
