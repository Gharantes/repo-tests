import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CardGridComponent, SigExtendableTableComponent } from '@synergia-frontend/components';
import {
  IDoExtendableTableActions,
  IDoExtendableTableColumnInfo,
  IDoListarEventos,
} from '@synergia-frontend/interfaces';
import { FiltroListarEventosComponent } from './components/filtro-listar-eventos/filtro-listar-eventos.component';
import { mapFromIDoListarEventosToIDoCardGridArray } from '@synergia-frontend/mappers';

@Component({
  selector: 'lib-page-listar-eventos-view',
  standalone: true,
  template: `
    <lib-filtro-page-listar-eventos></lib-filtro-page-listar-eventos>

    <div class="btn-line">
      <button mat-raised-button (click)="toNewEventPage()">
        <span>Criar novo evento</span>
        <mat-icon class="material-symbols-outlined">add</mat-icon>
      </button>
    </div>

    <lib-card-grid
      [data$]="cardGridData$()"
    ></lib-card-grid>

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
    MatButtonModule,
    FiltroListarEventosComponent,
    CardGridComponent
  ],
})
export class ListarEventosViewComponent {
  @Input() data$!: Signal<IDoListarEventos[]>;
  public cardGridData$ = computed(() => {
    return mapFromIDoListarEventosToIDoCardGridArray(this.data$())
  })


  @Output() toNewEventPageEvent = new EventEmitter<void>();
  public toNewEventPage() {
    return this.toNewEventPageEvent.emit();
  }

  @Output() editEntryEvent = new EventEmitter<IDoListarEventos>();
  @Output() deleteEntryEvent = new EventEmitter<IDoListarEventos>();
  @Output() viewDetailsEvent = new EventEmitter<IDoListarEventos>();
  public editEntry(el: IDoListarEventos) {
    this.editEntryEvent.emit(el);
  }
  public viewDetails(el: IDoListarEventos) {
    this.viewDetailsEvent.emit(el);
  }
  public deleteEntry(el: IDoListarEventos) {
    this.deleteEntryEvent.emit(el);
  }

  public readonly tableColumns: IDoExtendableTableColumnInfo<IDoListarEventos>[] =
    [
      {
        def: 'title',
        header: 'Nome',
        value: (element: IDoListarEventos) => {
          return element.title;
        },
      },
      {
        def: 'description',
        header: 'Descrição',
        value: (element: IDoListarEventos) => {
          return element.description;
        },
      },
      {
        def: 'created_by_id',
        header: 'Criado por',
        value: (element: IDoListarEventos) => {
          return element.createdByNameAccount;
        },
      },
    ];

  public readonly tableActions: IDoExtendableTableActions<IDoListarEventos>[] =
    [
      {
        label: 'Ver Detalhes',
        icon: '',
        action: (el: IDoListarEventos) => {
          this.viewDetails.bind(this)(el);
        },
        isAllowed: () => {
          return true;
        },
      },
      {
        label: 'Editar Evento',
        icon: '',
        action: (el: IDoListarEventos) => {
          this.editEntry.bind(this)(el);
        },
        isAllowed: () => {
          return true;
        },
      },
      {
        label: 'Deletar Evento',
        icon: '',
        action: (el: IDoListarEventos) => {
          this.deleteEntry.bind(this)(el);
        },
        isAllowed: () => {
          return true;
        },
      },
    ];
}
