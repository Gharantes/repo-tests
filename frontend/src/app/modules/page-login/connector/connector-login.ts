import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { inject, signal } from '@angular/core';
import { LoginInformationInputDto } from '@synergia-frontend/api';
import { ITenantModel } from '@synergia-frontend/interfaces';

export class ConnectorLogin {
  private readonly fb = inject(NonNullableFormBuilder);

  /** Tenant resolvido a partir do identifier da URL. */
  public tenant$ = signal<ITenantModel | null>(null);
  /** Identifier da URL que não corresponde a nenhum tenant. */
  public tenantNotFound$ = signal<string | null>(null);

  public readonly form = this.fb.group({
    user: this.fb.control<string>('', [Validators.required]),
    password: this.fb.control<string>('', [Validators.required]),
  });

  public getFormValue(): LoginInformationInputDto | null {
    const idTenant = this.tenant$()?.id;
    const login = this.form.controls.user.value;
    const password = this.form.controls.password.value;

    if (idTenant == null || login == null || password == null) {
      return null;
    }
    return { idTenant, login, password, checkLastSeen: false };
  }
}
