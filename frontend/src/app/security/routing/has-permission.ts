import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthPermissionCode, PermissionService, SnackbarService } from '@synergia-frontend/services';

/** Sem a permissão, volta para o dashboard do tenant com um aviso. */
function deny(route: ActivatedRouteSnapshot): UrlTree {
  inject(SnackbarService).showMessage('Você não tem permissão para abrir esta página.');
  const tenant = route.pathFromRoot.map((r) => r.paramMap.get('tenant')).find((t) => t != null);
  return inject(Router).createUrlTree(tenant ? [tenant, 'dashboard'] : ['']);
}

/** Libera a rota só para quem tem a permissão. Roda depois do HasActiveTenant do pai. */
export function hasPermission(code: AuthPermissionCode): CanActivateFn {
  return (route) => (inject(PermissionService).has(code) ? true : deny(route));
}

/** edit-account/:id: a própria conta sempre; as dos outros pedem EDIT_USER. */
export const canEditAccount: CanActivateFn = (route) => {
  const id = Number(route.paramMap.get('id'));
  return inject(PermissionService).canEditAccount(id) ? true : deny(route);
};
