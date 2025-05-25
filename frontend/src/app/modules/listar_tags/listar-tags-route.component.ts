import { Component, signal } from '@angular/core';
import { SigExtendableTableComponent } from '@synergia-frontend/components';
import { IDoExtendableTableColumnInfo } from '@synergia-frontend/interfaces';

@Component({
  selector: 'app-listar-tags-route',
  template: `
    <div></div>
    <lib-sig-extendable-table
      [actions]="[]"
      [columns]="[]"
      [data$]="data$"
    ></lib-sig-extendable-table>
  `,
  styleUrl: `./style.scss`,
  imports: [SigExtendableTableComponent],
})
export class ListarTagsRouteComponent {
  public readonly data$ = signal([]);

  constructor(
    // private readonly pageService:
  ) {
  }

  public readonly columns: IDoExtendableTableColumnInfo<never>[] = [
    { def: 'name', header: 'Nome', value: () => '' },
    { def: 'created_at', header: 'Criada em', value: () => '' },
  ];
}