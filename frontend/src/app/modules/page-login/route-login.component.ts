import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  LoginInformationResponseDto,
  PageLoginResourceService,
} from '@synergia-frontend/api';
import {
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import { catchError, EMPTY, filter, map, Observable, of, tap } from 'rxjs';
import { ConnectorLogin } from './connector/connector-login';
import { TenantDtoToModel } from '@synergia-frontend/mappers';
import { ITenantModel } from '@synergia-frontend/interfaces';
import { ViewLoginComponent } from './view/view-login.component';

@Component({
  selector: 'app-route-login',
  standalone: true,
  templateUrl: './route-login.component.html',
  styleUrl: './route-login.component.scss',
  providers: [],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRippleModule,
    ViewLoginComponent,
  ],
})
export class RouteLoginComponent implements AfterViewInit {
  public readonly tenants$ = signal<ITenantModel[]>([]);
  public readonly tenantSelected = signal<ITenantModel | null>(null);

  public readonly connector = inject(ConnectorLogin);

  constructor(
    public readonly routingService: RoutingService,
    private readonly pageService: PageLoginResourceService,
    private readonly snackService: SnackbarService,
    private readonly sessionService: SessionService
  ) {
    this.login(this.useStorage(), false);
  }

  private useStorage(): Observable<LoginInformationResponseDto | null> {
    const login = this.sessionService.retrieveSessionFromLocalStorage();
    if (login == null) {
      return of(null);
    }
    return this.pageService.checkLoginInformation({
      idTenant: login.tenant?.id as number,
      login: login.user?.label ?? '',
      password: '',
      checkLastSeen: true,
    });
  }
  private useForm(): Observable<LoginInformationResponseDto | null> {
    const value = this.connector.getFormValue();
    if (value == null) {
      return of(null);
    }
    return this.pageService.checkLoginInformation(value);
  }

  public attemptLogin() {
    this.login(this.useForm(), true);
  }
  public login(
    obs: Observable<LoginInformationResponseDto | null>,
    showMessage: boolean
  ): void {
    obs
      .pipe(
        catchError(() => {
          if (showMessage) {
            this.snackService.showMessage('Nâo foi possível realizar login.');
          }
          return EMPTY;
        }),
        tap((res) => {
          if (res == null && showMessage) {
            this.snackService.showMessage('Não foi possível realizar login.');
          }
        }),
        filter((res) => res != null),
        tap((res) => {
          this.sessionService.setTenant({
            id: res.idAccount,
            label: res.tenantTitle,
          });
          this.sessionService.setUser({
            id: res.idAccount,
            label: res.login,
          });
          this.sessionService.saveSessionOnLocalStorage();
          this.routingService.goToDashboard();
        })
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.pageService
      .listTenants()
      .pipe(
        map((res) => res.map((v) => TenantDtoToModel(v))),
        tap((res) => this.tenants$.set(res))
      )
      .subscribe();
  }
  public setNewTenant($event: ITenantModel) {
    this.connector.form.controls.idTenant.setValue($event.id);
    this.tenantSelected.set($event);
  }
}
