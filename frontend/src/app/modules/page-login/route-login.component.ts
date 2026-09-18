import { Component, inject, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  EntityTenantResourceService,
  LoginInformationResponseDto,
  PageLoginResourceService,
} from '@synergia-frontend/api';
import {
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import { catchError, EMPTY, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { ConnectorLogin } from './connector/connector-login';
import { TenantDtoToModel } from '@synergia-frontend/mappers';
import { ITenantModel } from '@synergia-frontend/interfaces';
import { ViewLoginComponent } from './view/view-login.component';

@Component({
  selector: 'app-route-login',
  standalone: true,
  templateUrl: './route-login.component.html',
  styleUrl: './route-login.component.scss',
  providers: [ConnectorLogin],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ViewLoginComponent],
})
export class RouteLoginComponent {
  public readonly connector = inject(ConnectorLogin);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    public readonly routingService: RoutingService,
    private readonly pageService: PageLoginResourceService,
    private readonly tenantService: EntityTenantResourceService,
    private readonly snackService: SnackbarService,
    private readonly sessionService: SessionService
  ) {
    this.route.paramMap
      .pipe(
        map((params) => params.get('tenant') ?? ''),
        switchMap((identifier) => this.resolveTenant(identifier)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((tenant) => {
        if (tenant != null) {
          this.login(this.useStorage(tenant), false);
        }
      });
  }

  private resolveTenant(identifier: string): Observable<ITenantModel | null> {
    this.connector.tenant$.set(null);
    this.connector.tenantNotFound$.set(null);

    return this.tenantService.listAllTenants().pipe(
      map((res) => res.map((v) => TenantDtoToModel(v)).find((t) => t.identifier === identifier) ?? null),
      catchError((err) => {
        this.snackService.catchError(err, 'Erro ao carregar o tenant.');
        return EMPTY;
      }),
      tap((tenant) => {
        this.connector.tenant$.set(tenant);
        this.connector.tenantNotFound$.set(tenant == null ? identifier : null);
      })
    );
  }

  /** Reaproveita a sessão guardada só se ela for do tenant da URL. */
  private useStorage(tenant: ITenantModel): Observable<LoginInformationResponseDto | null> {
    const login = this.sessionService.retrieveSessionFromLocalStorage();
    if (login == null || login.tenant?.identifier !== tenant.identifier) {
      return of(null);
    }
    return this.pageService.checkLoginInformation({
      idTenant: tenant.id,
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
            id: res.idTenant,
            label: res.tenantTitle,
            identifier: this.connector.tenant$()?.identifier ?? '',
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
}
