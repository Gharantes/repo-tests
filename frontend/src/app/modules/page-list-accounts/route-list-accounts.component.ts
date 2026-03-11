import { Component, signal } from '@angular/core';
import { ViewListAccountsComponent } from './view/view-list-accounts.component';
import { IAccountModel } from '@synergia-frontend/interfaces';
import {
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import { AccountDto, PageListAccountsResourceService } from '@synergia-frontend/api';
import { catchError, concatMap, EMPTY, map, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-page-listar-usuarios-route',
  standalone: true,
  templateUrl: './route-list-accounts.component.html',
  styleUrl: `./route-list-accounts.component.scss`,
  imports: [ViewListAccountsComponent],
})
export class RouteListAccountsComponent {
  public readonly data$ = signal<IAccountModel[]>([]);

  constructor(
    private readonly sessionService: SessionService,
    private readonly snackService: SnackbarService,
    private readonly routingService: RoutingService,
    private readonly pageService: PageListAccountsResourceService
  ) {
    this.getListAccounts().subscribe();
  }

  public getListAccounts(): Observable<unknown> {
    const idTenant = this.sessionService.getTenantId();
    if (idTenant == null) {
      this.data$.set([]);
      return of([]);
    }
    return this.pageService.listAccounts(idTenant, undefined).pipe(
      catchError((err) => {
        this.snackService.catchError(err, 'Erro ao trazer usuários.');
        return of([]);
      }),
      map<AccountDto[], IAccountModel[]>((res) => {
        return res.map(v => ({
          id: v.id,
          email: v.email,
          firstName: v.firstName,
          lastName: v.lastName,
          login: v.login,
        }))
      }),
      tap((res) => this.data$.set(res))
    );
  }

  public deleteAccount($event: IAccountModel) {
    this.pageService
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