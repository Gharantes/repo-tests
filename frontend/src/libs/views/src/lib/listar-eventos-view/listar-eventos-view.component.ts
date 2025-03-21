import { GmIconComponent } from '@synergia-frontend/ui';
import { CommonModule } from '@angular/common';
import { Component, Input, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IDoBasicEventInfo, IDoExtentendableTableColumnInfo } from '@synergia-frontend/interfaces';
import { SigExtendableTableComponent } from '@synergia-frontend/tables';

@Component({
  selector: 'lib-listar-eventos-view',
  standalone: true,
  template: ` 
    <div>Criar novo evento</div>

    <lib-gm-icon [type]="'outlined'" [image]="'dashboard'"></lib-gm-icon>
    <mat-icon class="material-symbols-outlined">dashboard</mat-icon>
    <mat-icon class="material-symbols-outlined">view_list</mat-icon>
    <mat-icon class="material-symbols-outlined">add</mat-icon>

    <lib-sig-extendable-table
      [data$]="data$" 
      [columns]="columns"
    ></lib-sig-extendable-table>
  `,
  styleUrl: 'style.scss',
  imports: [
    CommonModule, SigExtendableTableComponent, 
    MatIconModule, GmIconComponent],
})
export class ListarEventosViewComponent {
  @Input() data$!: Signal<IDoBasicEventInfo[]>;

  public readonly columns: IDoExtentendableTableColumnInfo<IDoBasicEventInfo>[] =[
    { def: 'title', header: 'Nome', 
      value: (element: IDoBasicEventInfo) => { return element.title; }
    },
    { def: 'description', header: 'Descrição', 
      value: (element: IDoBasicEventInfo) => { return element.description; }
    },
  ]
}
