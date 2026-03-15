import { Component, inject, signal } from '@angular/core';
import { IPermissionModel } from '@synergia-frontend/interfaces';
import { SessionService, SnackbarService } from '@synergia-frontend/services';
import { catchError, EMPTY, map, tap } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewListPermissionsComponent } from './view/view-list-permissions.component';
import { PageListPermissionsResourceService } from '@synergia-frontend/api';
import { ConnectorListPermissions } from './connector/connector-list-permissions';
import { PermissionDtoToModel } from '@synergia-frontend/mappers';

@Component({
  selector: 'app-route-list-permissions',
  standalone: true,
  templateUrl: './route-list-permissions.component.html',
  styleUrl: `./route-list-permissions.component.scss`,
  imports: [ReactiveFormsModule, ViewListPermissionsComponent],
})
export class RouteListPermissionsComponent {
  public readonly data$ = signal<IPermissionModel[]>([]);
  public connector = inject(ConnectorListPermissions);

  constructor(
    private readonly pageService: PageListPermissionsResourceService,
    private readonly sessionService: SessionService,
    private readonly snackbarService: SnackbarService
  ) {}

  public searchForPermissions() {
    const text = this.connector.textFieldControl.value;
    this.pageService
      .listPermissions(text)
      .pipe(
        map((res) => res.map((v) => PermissionDtoToModel(v))),
        tap((res) => this.data$.set(res)),
        catchError((err) => {
          this.snackbarService.catchError(err);
          return EMPTY;
        })
      )
      .subscribe();
  }
}