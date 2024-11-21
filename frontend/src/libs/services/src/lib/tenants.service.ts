import { Injectable, Signal, signal } from '@angular/core';
import { IDoIdentifier } from '@synergia-frontend/utils';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TenantsService {
  private readonly selectedTenant = signal<IDoIdentifier | null>(null)
  private readonly tenants = signal<IDoIdentifier[]>([]);

  constructor(
    private readonly localStorageService: LocalStorageService
  ) {}

  public getTenantAsSignal() {
    return this.selectedTenant.asReadonly();
  }
  public getTenant() {
    return this.selectedTenant();
  }
  public getTenantId() {
    return this.selectedTenant()?.id;
  }
  public getTenantLabel() {
    return this.selectedTenant()?.label;
  }

  public getTenantListAsSignal(): Signal<IDoIdentifier[]> {
    return this.tenants.asReadonly();
  }
  public getTenantList() {
    return this.tenants()
  }

  public setTenantsFromLocalStorage() {
    this.tenants.set(this.localStorageService.getTenantsFromLocalStorage())
  }
  public setTenant(tenant: IDoIdentifier) {
    const list = this.getTenantList();
    if (list.map(v => v.id).includes(tenant.id)) {
      this.selectedTenant.set(tenant);
    }
  }
  public setTenantFromLocalStorage(): IDoIdentifier | null {
    const lastTenant = this.localStorageService.getLastTenantSelectedFromLocalStorage();
    const list = this.getTenantList();

    if (lastTenant != null && list.map(v => v.id).includes(lastTenant.id)) {
      this.selectedTenant.set(lastTenant);
      return lastTenant;
    } else {
      if (list.length > 0) {
        this.selectedTenant.set(list[0]);
        this.localStorageService.setLastTenantSelectedToLocalStorage(list[0]);
        return list[0]
      } else {
        return null;
      }
    }
  }
}

