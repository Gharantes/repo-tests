import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { IDoExtendableTableActions, IDoExtendableTableColumnInfo } from '@synergia-frontend/interfaces';
import { GmIconComponent } from "../google-material-icon/gm-icon.component";

@Component({
    selector: 'lib-sig-extendable-table',
    templateUrl: 'index.html',
    styleUrl: './style.scss',
    imports: [
    CommonModule, MatTableModule,
    MatMenuModule, MatIconModule,
    GmIconComponent
]
})
export class SigExtendableTableComponent<T> implements AfterViewInit {
  @Input()
  columns!: IDoExtendableTableColumnInfo<T>[];
  @Input()
  actions: IDoExtendableTableActions<T>[] = [];

  @Input()
  data$!: Signal<T[]>;

  displayedColumns: string[] = []
  constructor (
    private readonly cdr: ChangeDetectorRef
  ) {};

  ngAfterViewInit() {
    this.displayedColumns.push(...this.columns.map(v => v.def));
    if (this.actions.length > 0) {
      this.displayedColumns.push('actions');
    }
    // this.cdr.detectChanges();
  }
}