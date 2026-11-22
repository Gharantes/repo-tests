import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { EntityAccountResourceService, EntityPermissionResourceService } from '@synergia-frontend/api';
import { IAccountModel, IPermissionProfileModel } from '@synergia-frontend/interfaces';
import { AccountDtoToModel } from '@synergia-frontend/mappers';
import { SessionService, SnackbarService } from '@synergia-frontend/services';
import { catchError, debounceTime, EMPTY, map, Observable, of, switchMap, tap } from 'rxjs';
import { ConnectorListPermissions } from '../connector/connector-list-permissions';
import { PermissionGroupsComponent } from '../permission-groups/permission-groups.component';
import { PermissionsPageStore, sameSet } from '../permissions-page.store';

const PALETTE = ['#3B52CC', '#FF7043', '#16A34A', '#9333EA', '#0891B2', '#DB2777', '#CA8A04', '#4F46E5'];

/**
 * Aba Usuários: escolhe um usuário e edita os perfis dele e as permissões avulsas.
 * O que vem de perfil aparece ligado e travado; o toggle mexe só nas avulsas.
 * As mudanças ficam em rascunho até "Salvar".
 */
@Component({
  selector: 'app-permissions-tab-accounts',
  standalone: true,
  templateUrl: './tab-accounts.component.html',
  styleUrl: './tab-accounts.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule, MatMenuModule, PermissionGroupsComponent],
  providers: [ConnectorListPermissions],
})
export class TabAccountsComponent {
  public readonly store = inject(PermissionsPageStore);
  public readonly connector = inject(ConnectorListPermissions);
  private readonly accountService = inject(EntityAccountResourceService);
  private readonly permissionApi = inject(EntityPermissionResourceService);
  private readonly sessionService = inject(SessionService);
  private readonly snackbar = inject(SnackbarService);

  public readonly accounts$ = signal<IAccountModel[]>([]);
  public readonly selected$ = signal<IAccountModel | null>(null);
  private readonly savedPermissions$ = signal<ReadonlySet<number>>(new Set());
  private readonly savedProfiles$ = signal<ReadonlySet<number>>(new Set());
  public readonly draftPermissions$ = signal<ReadonlySet<number>>(new Set());
  public readonly draftProfiles$ = signal<ReadonlySet<number>>(new Set());
  public readonly loading$ = signal(false);
  public readonly saving$ = signal(false);

  public readonly dirty$ = computed(
    () => !sameSet(this.savedPermissions$(), this.draftPermissions$()) || !sameSet(this.savedProfiles$(), this.draftProfiles$())
  );

  public readonly assignedProfiles$ = computed(() =>
    this.store.profiles$().filter((p) => this.draftProfiles$().has(p.id))
  );
  public readonly availableProfiles$ = computed(() =>
    this.store.profiles$().filter((p) => !this.draftProfiles$().has(p.id))
  );

  /** Permissões que vêm dos perfis do rascunho: id -> nome do(s) perfil(is). */
  public readonly inherited$ = computed(() => {
    const out = new Map<number, string>();
    this.assignedProfiles$().forEach((profile) =>
      profile.idPermissions.forEach((id) => out.set(id, out.has(id) ? `${out.get(id)}, ${profile.title}` : profile.title))
    );
    return out;
  });

  public readonly effectiveCount$ = computed(() => {
    const ids = new Set(this.draftPermissions$());
    this.inherited$().forEach((_, id) => ids.add(id));
    return ids.size;
  });

  /** Salvar assim tiraria do próprio usuário a permissão de gerenciar; o backend também recusa. */
  public readonly wouldLockMeOut$ = computed(() => {
    const manage = this.store.manageId();
    if (this.selected$()?.id !== this.store.myId || manage == null) return false;
    return !this.draftPermissions$().has(manage) && !this.inherited$().has(manage);
  });

  constructor() {
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
        this.snackbar.catchError(err, 'Erro ao trazer usuários.');
        return EMPTY;
      })
    );
  }

  public select(account: IAccountModel) {
    if (account.id === this.selected$()?.id) return;
    if (this.dirty$() && !confirm('Descartar as alterações não salvas?')) return;
    this.selected$.set(account);
    this.loading$.set(true);
    this.permissionApi
      .getAccountPermissionsDetail(account.id)
      .pipe(
        catchError((err) => {
          this.snackbar.catchError(err, 'Erro ao carregar as permissões do usuário.');
          return of({ idPermissions: [], idProfiles: [] });
        })
      )
      .subscribe((res) => {
        this.savedPermissions$.set(new Set(res.idPermissions));
        this.savedProfiles$.set(new Set(res.idProfiles));
        this.discard();
        this.loading$.set(false);
      });
  }

  public toggle(id: number) {
    if (!this.store.canManage()) return;
    const next = new Set(this.draftPermissions$());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this.draftPermissions$.set(next);
  }

  public toggleGroup(ids: number[]) {
    if (!this.store.canManage()) return;
    const next = new Set(this.draftPermissions$());
    const allOn = ids.every((id) => next.has(id));
    ids.forEach((id) => (allOn ? next.delete(id) : next.add(id)));
    this.draftPermissions$.set(next);
  }

  public addProfile(profile: IPermissionProfileModel) {
    this.draftProfiles$.set(new Set([...this.draftProfiles$(), profile.id]));
  }

  public removeProfile(profile: IPermissionProfileModel) {
    const next = new Set(this.draftProfiles$());
    next.delete(profile.id);
    this.draftProfiles$.set(next);
  }

  public discard() {
    this.draftPermissions$.set(this.savedPermissions$());
    this.draftProfiles$.set(this.savedProfiles$());
  }

  public save() {
    const account = this.selected$();
    const idRequester = this.store.myId;
    if (account == null || idRequester == null || !this.dirty$() || this.wouldLockMeOut$()) return;
    const idPermissions = [...this.draftPermissions$()];
    const idProfiles = [...this.draftProfiles$()];
    this.saving$.set(true);
    this.permissionApi
      .setAccountPermissions({ idRequester, idAccount: account.id, idPermissions, idProfiles })
      .pipe(
        switchMap(() => this.store.loadProfiles()),
        switchMap(() => (account.id === idRequester ? this.store.refreshMyPermissions() : of(undefined))),
        catchError((err) => {
          this.snackbar.catchError(err, 'Não foi possível salvar as permissões.');
          this.saving$.set(false);
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.savedPermissions$.set(new Set(idPermissions));
        this.savedProfiles$.set(new Set(idProfiles));
        this.saving$.set(false);
        this.snackbar.showMessage('Permissões salvas.');
      });
  }

  public fullName(a: IAccountModel): string {
    const name = `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim();
    return name || a.login;
  }

  public initials(a: IAccountModel): string {
    const first = a.firstName?.trim()?.[0] ?? a.login?.[0] ?? '?';
    const last = a.lastName?.trim()?.[0] ?? '';
    return (first + last).toUpperCase();
  }

  public colorFor(id: number): string {
    return PALETTE[Math.abs(id) % PALETTE.length];
  }
}
