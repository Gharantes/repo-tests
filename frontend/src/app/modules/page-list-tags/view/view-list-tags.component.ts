import { Component, DestroyRef, EventEmitter, Input, Output } from '@angular/core';
import { SigExtendableTableComponent } from '@synergia-frontend/components';
import {
  IDoExtendableTableActions,
  IDoExtendableTableColumnInfo,
  ITagModel,
} from '@synergia-frontend/interfaces';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { ConnectorListTags } from '../connector/connector-list-tags';
import { debounceTime, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-view-list-tags',
  standalone: true,
  templateUrl: './view-list-tags.component.html',
  styleUrl: `./view-list-tags.component.scss`,
  imports: [
    SigExtendableTableComponent,
    MatInput,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
  ],
})
export class ViewListTagsComponent {
  @Input() public data$!: ITagModel[]
  @Input() public connector!: ConnectorListTags;
  @Output() public lookupTagsEvent = new EventEmitter<void>();

  constructor(
    private readonly destroyRef: DestroyRef
  ) {
    this.watchForm()
  }
  public watchForm() {
    this.connector.textfieldControl.valueChanges
      .pipe(
        debounceTime(400),
        tap(() => this.lookupTagsEvent.emit()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public readonly columns: IDoExtendableTableColumnInfo<ITagModel>[] = [
    { def: 'name', header: 'Nome', value: (el) => el.name },
  ];
  public readonly actions: IDoExtendableTableActions<ITagModel>[] = [];
}