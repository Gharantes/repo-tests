import { IUpsertAccountModel } from '@synergia-frontend/interfaces';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { inject } from '@angular/core';
import { SessionService } from '@synergia-frontend/services';

export class ConnectorUpsertAccont {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly sessionService = inject(SessionService);

  public form = this.fb.group({
    idTenant: this.fb.control<number>(this.sessionService.getTenantId() as number),
    email: this.fb.control<string>('', [Validators.required]),
    login: this.fb.control<string>('', [Validators.required]),
    password: this.fb.control<string>('', [Validators.required]),
    firstName: this.fb.control<string>('', [Validators.required]),
    lastName: this.fb.control<string>('', [Validators.required]),
  });

  public getFormValue(): IUpsertAccountModel | null {
    const v = this.form.value;
    if (v.login == null || v.password == null || v.firstName == null || v.lastName == null || v.email == null || v.idTenant == null) {
      return null;
    }
    return {
      idTenant: v.idTenant,
      email: v.email,
      firstName: v.firstName,
      lastName: v.lastName,
      login: v.login,
      password: v.password
    }
  }

  public populateForm(input: IUpsertAccountModel) {
    this.form.controls.firstName.setValue(input.firstName)
    this.form.controls.login.setValue(input.login)
    this.form.controls.password.setValue(input.password)
    this.form.controls.lastName.setValue(input.lastName)
  }
}