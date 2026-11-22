import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IAccountModel, IPermissionModel } from '@synergia-frontend/interfaces';
import {
  AuthPermission,
  PermissionService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import { EntityAccountResourceService, EntityPermissionResourceService } from '@synergia-frontend/api';
import { AccountDtoToModel, PermissionDtoToModel } from '@synergia-frontend/mappers';
import { catchError, debounceTime, EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';
import { ViewListPermissionsComponent } from './view/view-list-permissions.component';
import { ConnectorListPermissions } from './connector/connector-list-permissions';

/**
 * Página de Permissões: escolhe um usuário à esquerda e liga/desliga as permissões
 * dele à direita. As mudanças ficam em rascunho até "Salvar".
 * Quem não tem MANAGE_PERMISSIONS vê tudo, mas não muda nada.
 */
@Component({
  selector: 'app-route-list-permissions',
  standalone: true,
  templateUrl: './route-list-permissions.component.html',
  styleUrl: `./route-list-permissions.component.scss`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ViewListPermissionsComponent],
  providers: [ConnectorListPermissions],
})
export class RouteListPermissionsComponent {
  public readonly connector = inject(ConnectorListPermissions);
  private readonly accountService = inject(EntityAccountResourceService);
  private readonly permissionApi = inject(EntityPermissionResourceService);
  private readonly permissionService = inject(PermissionService);
  private readonly sessionService = inject(SessionService);
  private readonly snackbarService = inject(SnackbarService);

  public readonly accounts$ = signal<IAccountModel[]>([]);
  public readonly catalog$ = signal<IPermissionModel[]>([]);
  public readonly selected$ = signal<IAccountModel | null>(null);
  /** O que está gravado para o usuário selecionado. */
  private readonly saved$ = signal<ReadonlySet<number>>(new Set());
  /** O que está na tela, com as mudanças ainda não salvas. */
  public readonly draft$ = signal<ReadonlySet<number>>(new Set());
  public readonly loadingAccount$ = signal(false);
  public readonly saving$ = signal(false);

  public readonly canManage = computed(() => this.permissionService.has(AuthPermission.MANAGE_PERMISSIONS));
  public readonly myId = this.sessionService.getUserId();
  public readonly dirty$ = computed(() => !sameSet(this.saved$(), this.draft$()));
  /** O próprio usuário não pode se tirar MANAGE_PERMISSIONS; o backend também recusa. */
  public readonly lockedIds$ = computed(() => {
    const manage = this.catalog$().find((p) => p.name === AuthPermission.MANAGE_PERMISSIONS);
    return this.selected$()?.id === this.myId && manage ? new Set([manage.id]) : new Set<number>();
  });

  constructor() {
    this.loadCatalog();
    this.watchSearch();
  }

  private loadCatalog() {
    this.permissionApi
      .listPermissions()
      .pipe(
        map((res) => res.map((v) => PermissionDtoToModel(v))),
        catchError((err) => {
          this.snackbarService.catchError(err, 'Erro ao carregar as permissões.');
          return of([]);
        })
      )
      .subscribe((res) => this.catalog$.set(res));
  }

  private watchSearch() {
    this.listAccounts('').subscribe();
    this.connector.textFieldControl.valueChanges
      .pipe(
        debounceTime(400),
        switchMap((text) => this.listAccounts(text)),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  private listAccounts(text: string): Observable<unknown> {
    const idTenant = this.sessionService.getTenantId();
    if (idTenant == null) return of([]);
    return this.accountService.listAccountsByTenant(idTenant, text.trim() || undefined).pipe(
      map((res) => res.map((v) => AccountDtoToModel(v))),
      tap((res) => this.accounts$.set(res)),
      catchError((err) => {
        this.snackbarService.catchError(err, 'Erro ao trazer usuários.');
        return EMPTY;
      })
    );
  }

  public select(account: IAccountModel) {
    if (account.id === this.selected$()?.id) return;
    if (this.dirty$() && !confirm('Descartar as alterações não salvas?')) return;
    this.selected$.set(account);
    this.loadingAccount$.set(true);
    this.permissionApi
      .listPermissionsOfAccount(account.id)
      .pipe(
        catchError((err) => {
          this.snackbarService.catchError(err, 'Erro ao carregar as permissões do usuário.');
          return of([]);
        })
      )
      .subscribe((res) => {
        const ids = new Set(res.map((p) => p.id));
        this.saved$.set(ids);
        this.draft$.set(ids);
        this.loadingAccount$.set(false);
      });
  }

  public toggle(id: number) {
    if (!this.canManage() || this.lockedIds$().has(id)) return;
    const next = new Set(this.draft$());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this.draft$.set(next);
  }

  /** Liga todas do grupo; se já estavam todas ligadas, desliga. */
  public toggleGroup(ids: number[]) {
    if (!this.canManage()) return;
    const locked = this.lockedIds$();
    const next = new Set(this.draft$());
    const allOn = ids.every((id) => next.has(id));
    ids.filter((id) => !locked.has(id)).forEach((id) => (allOn ? next.delete(id) : next.add(id)));
    this.draft$.set(next);
  }

  public discard() {
    this.draft$.set(this.saved$());
  }

  public save() {
    const account = this.selected$();
    const idRequester = this.myId;
    if (account == null || idRequester == null || !this.dirty$()) return;
    const ids = [...this.draft$()];
    this.saving$.set(true);
    this.permissionApi
      .setAccountPermissions({ idRequester, idAccount: account.id, idPermissions: ids })
      .pipe(
        // Mexer nas próprias permissões muda o que esta sessão pode ver.
        switchMap(() => (account.id === idRequester ? this.permissionService.refresh() : of(undefined))),
        catchError((err) => {
          this.snackbarService.catchError(err, 'Não foi possível salvar as permissões.');
          this.saving$.set(false);
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.saved$.set(new Set(ids));
        this.saving$.set(false);
        this.snackbarService.showMessage('Permissões salvas.');
      });
  }
}

function sameSet(a: ReadonlySet<number>, b: ReadonlySet<number>): boolean {
  return a.size === b.size && [...a].every((v) => b.has(v));
}
