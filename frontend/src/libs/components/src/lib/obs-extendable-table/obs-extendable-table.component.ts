import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { IDoExtendableTableColumnInfo } from '@synergia-frontend/interfaces';

@Component({
    selector: 'lib-obs-extendable-table',
    imports: [CommonModule, MatTableModule],
    templateUrl: 'index.html',
    styleUrl: './style.scss'
})
export class ObsExtendableTableComponent<T> implements AfterViewInit {
  @Input()
  columns!: IDoExtendableTableColumnInfo<T>[];

  @Input()
  data$!: Observable<T[]>;

  displayedColumns: string[] = []
  constructor (
    private readonly cdr: ChangeDetectorRef
  ) {};

  ngAfterViewInit() {
    this.displayedColumns.push(...this.columns.map(v => v.def));
    this.cdr.detectChanges();
  }
}