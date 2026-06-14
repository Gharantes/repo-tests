import { Component, inject, signal } from '@angular/core';
import { ViewListAccountsComponent } from './view/view-list-accounts.component';
import { IAccountModel } from '@synergia-frontend/interfaces';
import {
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import {
  EntityAccountResourceService,
  EntityDeleteByIdResourceService,
} from '@synergia-frontend/api';
import { catchError, concatMap, EMPTY, map, Observable, of, tap } from 'rxjs';
import { ConnectorListAccounts } from './connector/connector-list-accounts';
import { AccountDtoToModel } from '@synergia-frontend/mappers';

@Component({
  selector: 'app-route-list-accounts',
  standalone: true,
  templateUrl: './route-list-accounts.component.html',
  styleUrl: `./route-list-accounts.component.scss`,
  imports: [ViewListAccountsComponent],
  providers: [ConnectorListAccounts],
})
export class RouteListAccountsComponent {
  public readonly data$ = signal<IAccountModel[]>([]);
  public readonly connector = inject(ConnectorListAccounts);

  constructor(
    private readonly sessionService: SessionService,
    private readonly snackService: SnackbarService,
    private readonly routingService: RoutingService,
    private readonly entityAccountService: EntityAccountResourceService,
    private readonly entityDeleteByIdService: EntityDeleteByIdResourceService
  ) {
    this.getListAccounts().subscribe();
  }

  public getListAccounts(): Observable<unknown> {
    const idTenant = this.sessionService.getTenantId();
    if (idTenant == null) {
      this.data$.set([]);
      return of([]);
    }
    return this.entityAccountService
      .listAccountsByTenant(idTenant, undefined, true)
      .pipe(
        catchError((err) => {
          this.snackService.catchError(err, 'Erro ao trazer usuários.');
          return of([]);
        }),
        map((res) => res.map((v) => AccountDtoToModel(v))),
        tap((res) => this.data$.set(res))
      );
  }

  public deleteAccount($event: IAccountModel) {
    this.entityDeleteByIdService
      .deleteAccount($event.id)
      .pipe(
        catchError((err) => {
          this.snackService.catchError(err);
          return EMPTY;
        }),
        concatMap(() => this.getListAccounts())
      )
      .subscribe();
  }

  public createAccount() {
    this.routingService.goToCreateAccount();
  }
  public editAccount($event: IAccountModel) {
    this.routingService.goToEditAccount($event.id);
  }
}