import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

@Injectable()
export class ConnectorHome {
  private readonly fb = inject(NonNullableFormBuilder);

  public readonly form = this.fb.group({
    identifier: this.fb.control('', [Validators.required]),
  });

  public getIdentifier(): string | null {
    const identifier = this.form.controls.identifier.value.trim();
    return identifier.length > 0 ? identifier : null;
  }
}
