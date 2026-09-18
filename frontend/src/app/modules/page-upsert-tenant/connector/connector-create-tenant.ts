import { inject, Injectable } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ValidationErrors, Validators } from '@angular/forms';

/** Mesmo formato validado no backend (EntityTenantService): vira o primeiro segmento da URL. */
const IDENTIFIER_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
/** Caminhos da raiz do frontend (app.routes.ts). */
const RESERVED_IDENTIFIERS = ['create-tenant'];

function identifierValidator(control: AbstractControl<string>): ValidationErrors | null {
  const value = control.value;
  if (!value) {
    return null;
  }
  if (!IDENTIFIER_PATTERN.test(value)) {
    return { identifierFormat: true };
  }
  if (RESERVED_IDENTIFIERS.includes(value)) {
    return { identifierReserved: true };
  }
  return null;
}

@Injectable()
export class ConnectorCreateTenant {
  private readonly fb = inject(NonNullableFormBuilder);

  public readonly form = this.fb.group({
    title: this.fb.control('', [Validators.required]),
    identifier: this.fb.control('', [Validators.required, identifierValidator]),
    login: this.fb.control('', [Validators.required, Validators.pattern(/\S/)]),
    password: this.fb.control('', [Validators.required]),
  });
}
