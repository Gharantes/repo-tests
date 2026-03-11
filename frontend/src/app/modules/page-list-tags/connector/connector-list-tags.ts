import { NonNullableFormBuilder } from '@angular/forms';
import { inject } from '@angular/core';

export class ConnectorListTags {
  private readonly fb = inject(NonNullableFormBuilder);
  public readonly textfieldControl = this.fb.control<string>('');
}