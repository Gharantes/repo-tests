import { Injectable, signal } from '@angular/core';
import { IDoIdentifier } from '@synergia-frontend/utils';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TenantsService {
  public selectedTenant = signal<IDoIdentifier | null>(null)
  public tenants = signal<IDoIdentifier[]>([]);

  constructor(
    private readonly localStorageService: LocalStorageService
  ) {}

  public setTenantsFromLocalStorage() {
    this.tenants.set(this.localStorageService.getTenantsFromLocalStorage())
  }
}

