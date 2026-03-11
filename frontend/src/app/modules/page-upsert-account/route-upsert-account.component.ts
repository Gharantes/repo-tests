import { Component, inject, signal } from '@angular/core';
import {
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import { PageUpsertAccountResourceService } from '@synergia-frontend/api';
import { ViewUpsertAccountComponent } from './view/view-upsert-account.component';
import { ConnectorUpsertAccont } from './connector/connector-upsert-accont';
import { IUpsertAccountToDto } from '@synergia-frontend/mappers';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'app-route-upsert-account',
  standalone: true,
  templateUrl: './route-upsert-account.component.html',
  styleUrl: `./route-upsert-account.component.scss`,
  imports: [ViewUpsertAccountComponent],
})
export class RouteUpsertAccountComponent {
  public readonly connector = inject(ConnectorUpsertAccont);

  private readonly pageService = inject(PageUpsertAccountResourceService);
  private readonly routingService = inject(RoutingService);
  private readonly sessionService = inject(SessionService);
  private readonly snackService = inject(SnackbarService);

  public idAccount = signal<number | null>(null);

  public goToParentRoute() {
    this.routingService.goToListAccounts();
  }

  public getById() {
    // this.pageService.getCreateUsuarioDtoById(id);
  }
  public salvar() {
    const idAccount = this.idAccount();
    if (idAccount) {
      this.update(idAccount);
    } else {
      this.insert();
    }
  }

  private insert() {
    const obj = this.connector.getFormValue();
    if (obj == null) return;
    const params = IUpsertAccountToDto(obj);
    this.pageService
      .createAccount(params)
      .pipe(
        tap(() => {
          this.snackService.showMessage('Usuário registrado!');
          this.goToParentRoute();
        }),
        catchError((err) => {
          this.snackService.catchError(err);
          return EMPTY;
        })
      )
      .subscribe();
  }
  private update(idAccount: number) {
    const obj = this.connector.getFormValue();
    if (obj == null) return;
    const params = IUpsertAccountToDto(obj);

    this.pageService
      .updateAccount(idAccount, params)
      .pipe(
        tap(() => {
          this.snackService.showMessage('Usuário atualizado!');
          this.goToParentRoute();
        }),
        catchError((err) => {
          this.snackService.catchError(err);
          return EMPTY;
        })
      )
      .subscribe();
  }
}
