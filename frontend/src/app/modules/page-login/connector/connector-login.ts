import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { inject } from '@angular/core';
import { LoginInformationInputDto } from '@synergia-frontend/api';

export class ConnectorLogin {
  private readonly fb = inject(NonNullableFormBuilder);

  public readonly form = this.fb.group({
    idTenant: this.fb.control<number | null>(null, [Validators.required]),
    user: this.fb.control<string>('', [Validators.required]),
    password: this.fb.control<string>('', [Validators.required]),
  });

  public getFormValue(): LoginInformationInputDto | null {
    const idTenant = this.form.controls.idTenant.value;
    const login = this.form.controls.user.value;
    const password = this.form.controls.password.value;

    if (idTenant == null || login == null || password == null) {
      return null;
    }
    return { idTenant, login, password, checkLastSeen: false };
  }
}