import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ExtendableTableComponent, IDoExtentendableTableColumnInfo } from '@synergia-frontend/tables';
import { Observable } from 'rxjs';

@Component({
  selector: 'lib-listar-projetos-view',
  standalone: true,
  imports: [CommonModule, ExtendableTableComponent],
  template: ` 
    <lib-extendable-table
      [data$]="data$" 
      [columns]="columns"
    ></lib-extendable-table>
  `,
  styleUrl: 'style.scss',
})
export class ListarProjetosViewComponent {
  @Input() data$!: Observable<string[]>;

  public readonly columns: IDoExtentendableTableColumnInfo<string>[] =[
    { def: 'a', header: 'Textp', 
      value: (element: string) => { return element; }
    },
    { def: '5', header: '123sad', 
      value: (element: string) => { return element; }
    },
    { def: '2', header: '123sad', 
      value: (element: string) => { return element; }
    },
    { def: 'b', header: '123sad', 
      value: (element: string) => { return element; }
    },
    { def: 'c', header: '123sad', 
      value: (element: string) => { return element; }
    },
    { def: 'd', header: '123sad', 
      value: (element: string) => { return element; }
    },
    { def: 'e', header: '123sad', 
      value: (element: string) => { return element; }
    }
  ]
}
