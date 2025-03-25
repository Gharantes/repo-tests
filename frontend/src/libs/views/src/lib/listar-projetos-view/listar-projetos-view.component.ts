import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDoExtendableTableColumnInfo } from '@synergia-frontend/interfaces';
import { ObsExtendableTableComponent } from '@synergia-frontend/components';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-listar-projetos-view',
  standalone: true,
  template: ` 
    <div class="btn-line">
      <button mat-raised-button (click)="toNewProjectsPage()">
        <span>Criar novo projeto</span>
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
    MatIconModule, 
    ObsExtendableTableComponent,
    MatButtonModule
  ],
})
export class ListarProjetosViewComponent {
  @Input() data$!: Observable<string[]>;

  @Output() toNewProjectsPageEvent = new EventEmitter<void>();
  public toNewProjectsPage() {
    this.toNewProjectsPageEvent.emit();
  }
  
  public readonly columns: IDoExtendableTableColumnInfo<string>[] =[
    { def: 'a', header: 'Textp', 
      value: (element: string) => { return element; }
    },
  ]

}
