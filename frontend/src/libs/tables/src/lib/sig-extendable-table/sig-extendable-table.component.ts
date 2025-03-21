import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, Signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { IDoBasicEventInfo, IDoExtentendableTableColumnInfo } from '@synergia-frontend/interfaces';

@Component({
  selector: 'lib-sig-extendable-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: 'index.html',
  styleUrl: './style.scss',
})
export class SigExtendableTableComponent<T> implements AfterViewInit {
  @Input()
  columns!: IDoExtentendableTableColumnInfo<T>[];

  @Input()
  data$!: Signal<IDoBasicEventInfo[]>;

  displayedColumns: string[] = []
  constructor (
    private readonly cdr: ChangeDetectorRef
  ) {};

  ngAfterViewInit() {
    this.displayedColumns.push(...this.columns.map(v => v.def));
    this.cdr.detectChanges();
  }
}