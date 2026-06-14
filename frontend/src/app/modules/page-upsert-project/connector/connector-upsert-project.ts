import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { IProjectModel, ITagModel, IUpsertProjectModel } from '@synergia-frontend/interfaces';
import { SessionService } from '@synergia-frontend/services';
import { IUpsertProjectToDto } from '@synergia-frontend/mappers';
import { UpsertProjectDto } from '@synergia-frontend/api';

@Injectable()
export class ConnectorUpsertProject {
  public readonly fb = inject(NonNullableFormBuilder);
  public readonly sessionService = inject(SessionService);

  public readonly form = this.fb.group({
    idTenant: this.fb.control<number>(this.sessionService.getTenantId() as number, [Validators.required]),
    idAccount: this.fb.control<number>(this.sessionService.getUserId() as number, [Validators.required]),
    title: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required]),
    bannerUrl: this.fb.control<string|undefined>(undefined),
    tags: this.fb.control<ITagModel[]>([]),
  });

  public getFormValue(): UpsertProjectDto | null {
    const v = this.form.value;
    if (v.title == null || v.description == null || v.idTenant == null || v.idAccount == null) {
      return null;
    }
    const obj = {
      description: v.description,
      idAccount: v.idAccount,
      idTenant: v.idTenant,
      title: v.title,
      bannerUrl: v.bannerUrl,
      tags: v.tags?.map((t) => t.id) ?? [],
    };
    return IUpsertProjectToDto(obj)
  }

  public populateForm(value: IProjectModel) {
    this.form.controls.title.setValue(value.title);
    this.form.controls.description.setValue(value.description);
    this.form.controls.bannerUrl.setValue(value.bannerUrl);
    this.form.controls.tags.setValue(value.tags);
  }
}