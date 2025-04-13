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
    <lib-sig-extendable-table
      [data$]="data$" 
      [columns]="columns"
      [actions]="tableActions"
    ></lib-sig-extendable-table>

    <div class="btn-line">
      <button mat-raised-button (click)="toNewUserPage()">
        <span>Criar novo usuário</span>
        <mat-icon class="material-symbols-outlined">add</mat-icon>
      </button>
    </div>
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
  
  @Output() deleteEntryEvent = new EventEmitter<IDoBasicUsuarioInfo>();
  

  public readonly columns: IDoExtendableTableColumnInfo<IDoBasicUsuarioInfo>[] =[
    { def: 'id', header: 'ID', 
      value: (element: IDoBasicUsuarioInfo) => { return element.idAccount; }
    },
    { def: 'login', header: 'Login', 
      value: (element: IDoBasicUsuarioInfo) => { return element.login; }
    },
    { def: 'name', header: 'Nome', 
      value: (element: IDoBasicUsuarioInfo) => { 
        return (element.firstName ?? '') + ' ' + (element.lastName ?? '');
       }
    },
  ]
  
  public readonly tableActions: IDoExtendableTableActions<IDoBasicUsuarioInfo>[] = [
    { 
      label: 'Deletar Usuário',
      icon: '', 
      action: (el: IDoBasicUsuarioInfo) => { this.deleteEntryEvent.bind(this).emit(el) },
      isAllowed: () => { return true; }
    }
  ]
}
