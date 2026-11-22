import { inject, Injectable } from '@angular/core';
import { EntityPermissionResourceService } from '@synergia-frontend/api';
import { map, Observable, of, tap } from 'rxjs';
import { SessionService } from './session.service';

/** Códigos das permissões. Espelham o AuthPermissionsEnum do backend. */
export const AuthPermission = {
  VIEW_ACCOUNTS_PAGE: 'VIEW_ACCOUNTS_PAGE',
  VIEW_TAGS_PAGE: 'VIEW_TAGS_PAGE',
  VIEW_PERMISSIONS_PAGE: 'VIEW_PERMISSIONS_PAGE',
  CREATE_USER: 'CREATE_USER',
  EDIT_USER: 'EDIT_USER',
  DELETE_USER: 'DELETE_USER',
  CREATE_TAG: 'CREATE_TAG',
  EDIT_TAG: 'EDIT_TAG',
  DELETE_TAG: 'DELETE_TAG',
  CREATE_PROJECT: 'CREATE_PROJECT',
  EDIT_PROJECT_AS_NON_MEMBER: 'EDIT_PROJECT_AS_NON_MEMBER',
  ASSIGN_TAGS_PROJECT_AS_NON_MEMBER: 'ASSIGN_TAGS_PROJECT_AS_NON_MEMBER',
  DELETE_PROJECT_AS_NON_OWNER: 'DELETE_PROJECT_AS_NON_OWNER',
  CREATE_EVENT: 'CREATE_EVENT',
  EDIT_EVENT_AS_NON_MEMBER: 'EDIT_EVENT_AS_NON_MEMBER',
  ASSIGN_TAGS_EVENT_AS_NON_MEMBER: 'ASSIGN_TAGS_EVENT_AS_NON_MEMBER',
  DELETE_EVENT_AS_NON_OWNER: 'DELETE_EVENT_AS_NON_OWNER',
  MANAGE_PERMISSIONS: 'MANAGE_PERMISSIONS',
} as const;
export type AuthPermissionCode = (typeof AuthPermission)[keyof typeof AuthPermission];

/**
 * Atalhos para as regras de permissão usadas pelas telas. As permissões em si
 * ficam no SessionService; aqui só se carrega e se combina.
 *
 * O backend ainda não tem autenticação, então isto controla o que a interface
 * mostra; não impede quem chama a API direto.
 */
@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly session = inject(SessionService);
  private readonly api = inject(EntityPermissionResourceService);

  /** Recarrega do backend as permissões do usuário logado. */
  public refresh(): Observable<void> {
    const idAccount = this.session.getUserId();
    if (idAccount == null) {
      this.session.setPermissions([]);
      return of(undefined);
    }
    return this.api.listPermissionsOfAccount(idAccount).pipe(
      tap((res) => this.session.setPermissions(res.map((p) => p.name))),
      map(() => undefined)
    );
  }

  public has(code: AuthPermissionCode): boolean {
    return this.session.hasPermission(code);
  }

  public hasAny(...codes: AuthPermissionCode[]): boolean {
    return codes.some((c) => this.session.hasPermission(c));
  }

  /** Cada um sempre pode editar a própria conta; as dos outros pedem EDIT_USER. */
  public canEditAccount(idAccount: number): boolean {
    return idAccount === this.session.getUserId() || this.has(AuthPermission.EDIT_USER);
  }

  private isMember(members: { id: number }[] | undefined): boolean {
    const me = this.session.getUserId();
    return me != null && (members ?? []).some((m) => m.id === me);
  }

  public canEditProject(project: { members?: { id: number }[] }): boolean {
    return this.isMember(project.members) || this.has(AuthPermission.EDIT_PROJECT_AS_NON_MEMBER);
  }
  public canChangeProjectTags(project: { members?: { id: number }[] }): boolean {
    return this.isMember(project.members) || this.has(AuthPermission.ASSIGN_TAGS_PROJECT_AS_NON_MEMBER);
  }

  public canEditEvent(event: { members?: { id: number }[] }): boolean {
    return this.isMember(event.members) || this.has(AuthPermission.EDIT_EVENT_AS_NON_MEMBER);
  }
  public canChangeEventTags(event: { members?: { id: number }[] }): boolean {
    return this.isMember(event.members) || this.has(AuthPermission.ASSIGN_TAGS_EVENT_AS_NON_MEMBER);
  }
}
