import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { IUpsertProjectModel } from '@synergia-frontend/interfaces';
import ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import Session = ts.server.Session;
import { SessionService } from '@synergia-frontend/services';

@Injectable()
export class ConnectorUpsertProject {
  public readonly fb = inject(NonNullableFormBuilder);
  public readonly sessionService = inject(SessionService);

  public readonly form = this.fb.group({
    idTenant: this.fb.control<number>(this.sessionService.getTenantId() as number, [Validators.required]),
    idAccount: this.fb.control<number>(this.sessionService.getUserId() as number, [Validators.required]),
    title: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required]),
    urlBanner: this.fb.control<string|null>(null),
    tags: this.fb.control<number[]>([]),
  });

  public getFormValue(): IUpsertProjectModel | null {
    const v = this.form.value;
    if (v.title == null || v.description == null || v.idTenant == null || v.idAccount == null) {
      return null;
    }
    return {
      description: v.description,
      idAccount: v.idAccount,
      idTenant: v.idTenant,
      title: v.title,
      urlBanner: v.urlBanner ?? null,
      tags: v.tags ?? [],
    };
  }

  public populateForm(value: IUpsertProjectModel) {
    this.form.controls.title.setValue(value.title);
    this.form.controls.description.setValue(value.description);
    this.form.controls.tags.setValue(value.tags);
    this.form.controls.urlBanner.setValue(value.urlBanner);
  }
}