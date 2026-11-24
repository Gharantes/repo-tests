import { Component, inject, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  EntityTenantResourceService,
  LoginInformationResponseDto,
  PageLoginResourceService,
} from '@synergia-frontend/api';
import {
  PermissionService,
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import {
  catchError,
  combineLatest,
  EMPTY,
  filter,
  finalize,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
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
  private readonly permissionService = inject(PermissionService);
  private readonly reloadTenant$ = new Subject<void>();

  public retryTenant(): void {
    this.reloadTenant$.next();
  }

  constructor(
    public readonly routingService: RoutingService,
    private readonly pageService: PageLoginResourceService,
    private readonly tenantService: EntityTenantResourceService,
    private readonly snackService: SnackbarService,
    private readonly sessionService: SessionService
  ) {
    combineLatest([
      this.route.paramMap.pipe(map((params) => params.get('tenant') ?? '')),
      this.reloadTenant$.pipe(startWith(undefined)),
    ])
      .pipe(
        switchMap(([identifier]) => this.resolveTenant(identifier)),
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
    this.connector.tenantLoadFailed$.set(false);
    this.connector.tenantLoading$.set(true);

    return this.tenantService.listAllTenants().pipe(
      map((res) => res.map((v) => TenantDtoToModel(v)).find((t) => t.identifier === identifier) ?? null),
      catchError((err) => {
        this.snackService.catchError(err, 'Erro ao carregar o tenant.');
        this.connector.tenantLoadFailed$.set(true);
        return EMPTY;
      }),
      finalize(() => this.connector.tenantLoading$.set(false)),
      tap((tenant) => {
        this.connector.tenant$.set(tenant);
        this.connector.tenantNotFound$.set(tenant == null ? identifier : null);
      })
    );
  }

  /**
   * Reaproveita a sessão guardada só se ela for do tenant da URL. Quem confirma
   * que ela ainda vale é o backend, pelo token: sem token válido, volta ao login.
   */
  private useStorage(tenant: ITenantModel): Observable<LoginInformationResponseDto | null> {
    const login = this.sessionService.retrieveSessionFromLocalStorage();
    if (login == null || login.tenant?.identifier !== tenant.identifier || !login.token) {
      return of(null);
    }
    this.sessionService.setToken(login.token);
    return this.pageService.sessaoAtual().pipe(
      catchError(() => {
        // Sessão vencida ou encerrada: limpa o que estava guardado e mostra o formulário.
        this.sessionService.logout();
        return of(null);
      })
    );
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
          this.sessionService.setToken(res.token);
          this.sessionService.saveSessionOnLocalStorage();
        }),
        // As telas e as rotas conferem as permissões; elas precisam estar carregadas antes de entrar.
        switchMap(() =>
          this.permissionService.refresh().pipe(
            catchError(() => {
              this.snackService.showMessage('Não foi possível carregar suas permissões.');
              return of(undefined);
            })
          )
        ),
        tap(() => this.routingService.goToDashboard())
      )
      .subscribe();
  }
}
