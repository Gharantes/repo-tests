import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';

@Injectable()
export class ConnectorListProjects {
  private readonly fb = inject(NonNullableFormBuilder)

  public readonly form = this.fb.group({
    text: this.fb.control('')
  })
}