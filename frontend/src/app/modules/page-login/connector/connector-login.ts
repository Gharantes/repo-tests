import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoginInformationInputDto } from '@synergia-frontend/api';
import { ITenantModel } from '@synergia-frontend/interfaces';

export class ConnectorLogin {
  private readonly fb = inject(NonNullableFormBuilder);

  public tenants$ = signal<ITenantModel[]>([])
  public tenantsFiltered$ = signal<ITenantModel[]>([])

  public readonly form = this.fb.group({
    user: this.fb.control<string>('', [Validators.required]),
    password: this.fb.control<string>('', [Validators.required]),
    tenant: this.fb.control<string|ITenantModel|null>(null, [Validators.required])
  });

  constructor() {
    this.form.controls.tenant.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => this.filterTenants(value));
  }

  private filterTenants(value: string | ITenantModel | null): void {
    const search = (typeof value === 'string' ? value : value?.title) ?? '';
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      this.tenantsFiltered$.set(this.tenants$());
      return;
    }

    this.tenantsFiltered$.set(
      this.tenants$().filter(
        (tenant) =>
          tenant.title.toLowerCase().includes(normalized) ||
          tenant.identifier.toLowerCase().includes(normalized)
      )
    );
  }

  public getFormValue(): LoginInformationInputDto | null {
    const tenant = this.form.controls.tenant.value;
    if (tenant == null || typeof tenant == 'string') {
      return null;
    }
    const idTenant = tenant.id;
    const login = this.form.controls.user.value;
    const password = this.form.controls.password.value;

    if (idTenant == null || login == null || password == null) {
      return null;
    }
    return { idTenant, login, password, checkLastSeen: false };
  }
}