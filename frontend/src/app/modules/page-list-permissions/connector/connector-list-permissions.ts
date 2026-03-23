import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';

@Injectable()
export class ConnectorListPermissions {
  private readonly fb = inject(NonNullableFormBuilder)
  public readonly textFieldControl = this.fb.control('');
}