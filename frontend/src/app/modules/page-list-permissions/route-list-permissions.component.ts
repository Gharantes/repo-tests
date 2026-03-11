import { Component, inject, signal } from '@angular/core';
import {
  IDoExtendableTableActions,
  IDoExtendableTableColumnInfo,
  ITagModel,
} from '@synergia-frontend/interfaces';
import { SessionService, SnackbarService } from '@synergia-frontend/services';
import { catchError, debounceTime, EMPTY, map, tap } from 'rxjs';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ViewListPermissionsComponent } from './view/view-list-permissions.component';
import { PageListPermissionsResourceService } from '@synergia-frontend/api';
import { ConnectorListPermissions } from './connector/connector-list-permissions';

@Component({
  selector: 'app-listar-tags-route',
  standalone: true,
  templateUrl: './route-list-permissions.component.html',
  styleUrl: `./route-list-permissions.component.scss`,
  imports: [ReactiveFormsModule, ViewListPermissionsComponent],
})
export class RouteListPermissionsComponent {
  public readonly data$ = signal<ITagModel[]>([]);
  public connector= inject(ConnectorListPermissions);

  constructor(
    private readonly pageService: PageListPermissionsResourceService,
    private readonly sessionService: SessionService,
    private readonly snackbarService: SnackbarService,
  ) {
  }



  private searchForPermissions() {
    const text = this.connector.textFieldControl.value
    this.pageService
      .listPermissions(text)
      .pipe(
        map((res) => listarTagsDtoToIDoArray(res)),
        tap((res) => this.data$.set(res)),
        catchError(err => {
          this.snackbarService.catchError(err);
          return EMPTY
        })
      )
      .subscribe();
  }
  public readonly columns: IDoExtendableTableColumnInfo<IDoListarTags>[] = [
    { def: 'name', header: 'Nome', value: (el) => el.name },
    { def: 'created_at', header: 'Criada em', value: (el) => el.createdAt },
  ];
  public readonly actions: IDoExtendableTableActions<IDoListarTags>[] = [
    {
      icon: '',
      label: 'Excluir',
      isAllowed: () => true,
      action: (el) => {
        this.deleteTag.bind(this)(el.id);
      },
    },
  ];

  private deleteTag(id: number) {
    this.pageService
      .deleteTag(id)
      .pipe(tap(() => this.searchForPermissions()))
      .subscribe();
  }
  public createTag() {
    this.pageService
      .insertTag({
        idTenant: this.sessionService.getTenantId() as number,
        name: this.textfieldControl.value,
      })
      .pipe(
        catchError((err) => {
          this.snackbarService.catchError(err);
          return EMPTY;
        }),
        tap(() => this.searchForPermissions())
      )
      .subscribe();
  }
}