import { computed, inject, Injectable, signal } from '@angular/core';
import { EntityPermissionResourceService } from '@synergia-frontend/api';
import { IPermissionModel, IPermissionProfileModel } from '@synergia-frontend/interfaces';
import { PermissionDtoToModel, PermissionProfileDtoToModel } from '@synergia-frontend/mappers';
import { AuthPermission, PermissionService, SessionService, SnackbarService } from '@synergia-frontend/services';
import { catchError, map, Observable, of, tap } from 'rxjs';

/** Estado dividido pelas duas abas da página: o catálogo de permissões e os perfis do tenant. */
@Injectable()
export class PermissionsPageStore {
  private readonly api = inject(EntityPermissionResourceService);
  private readonly session = inject(SessionService);
  private readonly permissionService = inject(PermissionService);
  private readonly snackbar = inject(SnackbarService);

  public readonly catalog$ = signal<IPermissionModel[]>([]);
  public readonly profiles$ = signal<IPermissionProfileModel[]>([]);
  public readonly canManage = computed(() => this.permissionService.has(AuthPermission.MANAGE_PERMISSIONS));
  public readonly myId = this.session.getUserId();
  public readonly idTenant = this.session.getTenantId();

  public readonly manageId = computed(
    () => this.catalog$().find((p) => p.name === AuthPermission.MANAGE_PERMISSIONS)?.id
  );

  constructor() {
    this.api
      .listPermissions()
      .pipe(
        map((res) => res.map((v) => PermissionDtoToModel(v))),
        catchError((err) => {
          this.snackbar.catchError(err, 'Erro ao carregar as permissões.');
          return of([]);
        })
      )
      .subscribe((res) => this.catalog$.set(res));
    this.loadProfiles().subscribe();
  }

  public loadProfiles(): Observable<IPermissionProfileModel[]> {
    if (this.idTenant == null) return of([]);
    return this.api.listProfiles(this.idTenant).pipe(
      map((res) => res.map((v) => PermissionProfileDtoToModel(v))),
      tap((res) => this.profiles$.set(res)),
      catchError((err) => {
        this.snackbar.catchError(err, 'Erro ao carregar os perfis.');
        return of([]);
      })
    );
  }

  /** Depois de mexer em algo que pode afetar o próprio usuário, recarrega o que a sessão pode ver. */
  public refreshMyPermissions(): Observable<void> {
    return this.permissionService.refresh();
  }
}

export function sameSet(a: ReadonlySet<number>, b: ReadonlySet<number>): boolean {
  return a.size === b.size && [...a].every((v) => b.has(v));
}
