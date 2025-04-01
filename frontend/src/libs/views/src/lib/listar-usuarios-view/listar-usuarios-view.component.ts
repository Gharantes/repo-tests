import { ObsExtendableTableComponent } from '@synergia-frontend/components';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { IDoBasicUsuarioInfo, IDoExtendableTableActions, IDoExtendableTableColumnInfo } from '@synergia-frontend/interfaces';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SigExtendableTableComponent } from "../../../../components/src/lib/sig-extendable-table/sig-extendable-table.component";

@Component({
  selector: 'lib-listar-usuarios-view',
  standalone: true,
  template: ` 
  
    <div class="btn-line">
      <button mat-raised-button (click)="toNewUserPage()">
        <span>Criar novo usuário</span>
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
],
})
export class ListarUsuariosViewComponent {
  @Input() data$!: Signal<IDoBasicUsuarioInfo[]>;

  @Output() public readonly toNewUserPageEvent = new EventEmitter<void>();
  public toNewUserPage() { return this.toNewUserPageEvent.emit(); }
  
  @Output() editEntryEvent = new EventEmitter<IDoBasicUsuarioInfo>();
  

  public readonly columns: IDoExtendableTableColumnInfo<IDoBasicUsuarioInfo>[] =[
    { def: 'id', header: 'ID', 
      value: (element: IDoBasicUsuarioInfo) => { return element.id; }
    },
    { def: 'name', header: 'Nome', 
      value: (element: IDoBasicUsuarioInfo) => { return element.name; }
    },
  ]
  
  public readonly tableActions: IDoExtendableTableActions<IDoBasicUsuarioInfo>[] = [
    { 
      label: 'Editar Projeto',
      icon: '', 
      action: (el: IDoBasicUsuarioInfo) => { this.editEntryEvent.bind(this).emit(el) },
      isAllowed: () => { return true; }
    }
  ]
}
