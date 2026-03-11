import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { IUpsertEventModel } from '@synergia-frontend/interfaces';
import { SessionService } from '@synergia-frontend/services';

@Injectable()
export class ConnectorUpsertEvent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly sessionService = inject(SessionService);

  public readonly form = this.fb.group({
    idAccount: this.fb.control<number>(this.sessionService.getUserId() as number),
    idTenant: this.fb.control<number>(this.sessionService.getTenantId() as number),
    title: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required]),
    urlBanner: this.fb.control<string|null>(null, []),
    tags: this.fb.control<number[]>([]),
  });

  public getFormValue(): IUpsertEventModel | null {
    const v = this.form.value;
    if (v.title == null || v.description == null || v.idAccount == null || v.idTenant == null) {
      return null;
    }
    return {
      idAccount: v.idAccount,
      idTenant: v.idTenant,
      description: v.description,
      title: v.title,
      urlBanner: v.urlBanner ?? null,
      tags: v.tags ?? [],
    };
  }
  public populateForm(res: IUpsertEventModel) {
    this.form.controls.title.setValue(res.title);
    this.form.controls.description.setValue(res.description);
    this.form.controls.urlBanner.setValue(res.urlBanner);
  }
}