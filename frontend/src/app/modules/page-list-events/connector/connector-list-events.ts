import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';

@Injectable()
export class ConnectorListEvents {
  private readonly fb = inject(NonNullableFormBuilder)

  public form = this.fb.group({
    text: this.fb.control<string>('')
  })
}