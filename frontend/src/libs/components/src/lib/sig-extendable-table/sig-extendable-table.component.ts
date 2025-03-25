import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, Signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { IDoBasicEventInfo, IDoExtendableTableActions, IDoExtendableTableColumnInfo } from '@synergia-frontend/interfaces';
import { GmIconComponent } from "../google-material-icon/gm-icon.component";
import { GmIconButtonComponent } from "../gm-icon-button/gm-icon-button.component";

@Component({
  selector: 'lib-sig-extendable-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, GmIconComponent, GmIconButtonComponent],
  templateUrl: 'index.html',
  styleUrl: './style.scss',
})
export class SigExtendableTableComponent<T> implements AfterViewInit {
  @Input()
  columns!: IDoExtendableTableColumnInfo<T>[];
  @Input()
  actions: IDoExtendableTableActions<T>[] = [];

  @Input()
  data$!: Signal<IDoBasicEventInfo[]>;

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