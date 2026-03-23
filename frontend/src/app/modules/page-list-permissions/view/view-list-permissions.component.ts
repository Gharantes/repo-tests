import {
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SigExtendableTableComponent } from '@synergia-frontend/components';
import {
  IDoExtendableTableActions,
  IDoExtendableTableColumnInfo,
  IPermissionModel,
  ITagModel,
} from '@synergia-frontend/interfaces';
import { debounceTime, tap } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ConnectorListPermissions } from '../connector/connector-list-permissions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-view-list-permissions',
  standalone: true,
  templateUrl: './view-list-permissions.component.html',
  styleUrl: `./view-list-permissions.component.scss`,
  imports: [SigExtendableTableComponent, ReactiveFormsModule],
})
export class ViewListPermissionsComponent {
  @Input() data$!: IPermissionModel[];
  @Input() connector!: ConnectorListPermissions;
  @Output() lookupEvent = new EventEmitter<void>();

  constructor(private readonly destroyRef: DestroyRef) {
    this.watchTextFieldControl();
  }

  private watchTextFieldControl() {
    this.connector.textFieldControl.valueChanges
      .pipe(
        debounceTime(400),
        tap(() => this.lookupEvent.emit()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public readonly columns: IDoExtendableTableColumnInfo<IPermissionModel>[] = [
    { def: 'name', header: 'Nome', value: (el) => el.name },
  ];
  public readonly actions: IDoExtendableTableActions<IPermissionModel>[] = [];
}