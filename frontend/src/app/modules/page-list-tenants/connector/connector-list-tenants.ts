import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

@Injectable()
export class ConnectorListTenants {
  private readonly fb = inject(NonNullableFormBuilder);

  public readonly form = this.fb.group({
    password: this.fb.control('', [Validators.required]),
  });
}
