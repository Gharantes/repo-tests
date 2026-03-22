import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

@Injectable()
export class ConnectorCreateTenant {
  private readonly fb = inject(NonNullableFormBuilder);

  public readonly form = this.fb.group({
    title: this.fb.control('', [Validators.required]),
    identifier: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    isPrivate: this.fb.control(false, [Validators.required])
  });
}