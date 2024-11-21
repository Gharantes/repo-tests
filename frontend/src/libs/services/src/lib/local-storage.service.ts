import { Injectable, signal } from '@angular/core';
import { IDoIdentifier, isBlankOrNull } from '@synergia-frontend/utils';
import { SnackbarService } from './snackbar/snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(private readonly snackbarService: SnackbarService) {
  }

  public setLastTenantSelectedToLocalStorage(tenant: IDoIdentifier) {
    localStorage.setItem('last-tenant', JSON.stringify(tenant));
  }
  public getLastTenantSelectedFromLocalStorage(): IDoIdentifier | null {
    const lastTenantAsString = localStorage.getItem('last-tenant');

    if (isBlankOrNull(lastTenantAsString)) {
      return null;
    } else {
      return JSON.parse(lastTenantAsString as string) as IDoIdentifier;
    }
  }

  public getTenantsFromLocalStorage(): IDoIdentifier[] {
    const tenantsAsString = localStorage.getItem('tenants');
    if (isBlankOrNull(tenantsAsString)) {
      localStorage.setItem('tenants', JSON.stringify([]));
      return []
    } else {
      return JSON.parse(tenantsAsString as string) as IDoIdentifier[];
    }
  }
  public addTenantToLocalStorage(tenant: IDoIdentifier) {
    const tenants = this.getTenantsFromLocalStorage();

    if (tenants.map(v => v.id).includes(tenant.id)) {
      this.snackbarService.temporaryMessage('Tenant list already includes this tenant.');
      return;
    }

    tenants.push(tenant);
    localStorage.setItem('tenants', JSON.stringify(tenants));
  }
}

