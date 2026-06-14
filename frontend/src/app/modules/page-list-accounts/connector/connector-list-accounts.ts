import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { ITagModel } from '@synergia-frontend/interfaces';

@Injectable()
export class ConnectorListAccounts {
  private readonly fb = inject(NonNullableFormBuilder);

  public readonly form = this.fb.group({
    text: this.fb.control<string>(''),
    tags: this.fb.control<ITagModel[]>([])
  });
}
