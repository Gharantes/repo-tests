import { ObsExtendableTableComponent } from '@synergia-frontend/components';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDoExtendableTableColumnInfo } from '@synergia-frontend/interfaces';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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

    <lib-obs-extendable-table
      [data$]="data$" 
      [columns]="columns"
    ></lib-obs-extendable-table>
  `,
  styleUrl: 'style.scss',
  imports: [
    CommonModule, 
    ObsExtendableTableComponent, 
    MatIconModule,
    MatButtonModule
  ],
})
export class ListarUsuariosViewComponent {
  @Input() data$!: Observable<string[]>;

  @Output() public readonly toNewUserPageEvent = new EventEmitter<void>();
  public toNewUserPage() {
    return this.toNewUserPageEvent.emit()
  }
  
  public readonly columns: IDoExtendableTableColumnInfo<string>[] =[
    { def: 'a', header: 'Textp', 
      value: (element: string) => { return element; }
    },
  ]
}
