import { Injectable, signal } from '@angular/core';
import { IDoIdentifier } from '@synergia-frontend/utils';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(private readonly snackbarService: SnackbarService) {
  }
  public getTenantsFromLocalStorage(): IDoIdentifier[] {
    const tenantsAsString = localStorage.getItem('tenants');
    if (tenantsAsString) {
      return JSON.parse(tenantsAsString) as IDoIdentifier[];
    } else {
      localStorage.setItem('tenants', JSON.stringify([]));
      return []
    }
  }
  public addTenantToLocalStorage(tenant: IDoIdentifier) {
    const tenants = this.getTenantsFromLocalStorage();

    if (tenants.map(v => v.id).includes(tenant.id)) {
      this.snackbarService.show('Tenant list already includes this tenant.');
      return;
    }

    tenants.push(tenant);
    localStorage.setItem('tenants', JSON.stringify(tenants));
  }
}

