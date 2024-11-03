import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTable, MatTableModule } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { IDoExtentendableTableColumnInfo } from './i-do-extentendable-table-column-info';

@Component({
  selector: 'lib-extendable-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  template: `
    <table id="table" mat-table [dataSource]="data$">
      <ng-container *ngFor="let column of columns" [matColumnDef]="column.def">
        <th mat-header-cell *matHeaderCellDef>{{ column.header }}</th>
        <td mat-cell *matCellDef="let element">{{ column.value(element) }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styleUrl: './extendable-table.component.scss',
})
export class ExtendableTableComponent<T> implements AfterViewInit {
  @Input()
  columns!: IDoExtentendableTableColumnInfo<T>[];

  @Input()
  data$!: Observable<T[]>;

  displayedColumns: string[] = [];

  constructor(
    private readonly cdr: ChangeDetectorRef
  ) {
  }
  ngAfterViewInit() {
    console.log("TESTE")
    this.displayedColumns.push(
      ...this.columns.map(v => v.def)
    )
    console.log(this.displayedColumns);
    this.cdr.detectChanges();
  }
}