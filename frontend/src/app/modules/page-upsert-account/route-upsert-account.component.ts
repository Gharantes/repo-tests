import { Component, inject, signal } from '@angular/core';
import {
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import {
  EntityAccountResourceService,
  EntityGetByIdResourceService,
} from '@synergia-frontend/api';
import { ViewUpsertAccountComponent } from './view/view-upsert-account.component';
import { ConnectorUpsertAccont } from './connector/connector-upsert-accont';
import {
  AccountDtoToModel,
  IUpsertAccountToDto,
} from '@synergia-frontend/mappers';
import { catchError, EMPTY, map, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-route-upsert-account',
  standalone: true,
  templateUrl: './route-upsert-account.component.html',
  styleUrl: `./route-upsert-account.component.scss`,
  imports: [ViewUpsertAccountComponent],
  providers: [ConnectorUpsertAccont],
})
export class RouteUpsertAccountComponent {
  public readonly connector = inject(ConnectorUpsertAccont);

  private readonly entityAccountService = inject(EntityAccountResourceService);
  private readonly entityGetByIdService = inject(EntityGetByIdResourceService);
  private readonly routingService = inject(RoutingService);
  private readonly sessionService = inject(SessionService);
  private readonly snackService = inject(SnackbarService);
  private readonly activatedRoute = inject(ActivatedRoute);

  public idAccount = signal<number | null>(null);

  public goToParentRoute() {
    this.routingService.goToListAccounts();
  }

  constructor() {
    this.routingService
      .getParamFromRoute(this.activatedRoute, 'id')
      .then((res) => {
        res ? this.idAccount.set(Number(res)) : undefined;

        this.fillForm();
      });
  }
  public fillForm() {
    const id = this.idAccount();
    if (id == null) {
      return;
    }
    this.entityGetByIdService
      .getAccountById(id)
      .pipe(
        map((res) => AccountDtoToModel(res)),
        tap((res) => {
          const controls = this.connector.form.controls;
          controls.login.setValue(res.login);
          controls.firstName.setValue(res.firstName);
          controls.lastName.setValue(res.lastName);
          controls.email.setValue(res.email);
        })
      )
      .subscribe();
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
    this.entityAccountService
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

    this.entityAccountService
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
