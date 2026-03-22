import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { TagDto, UpsertTagDto } from '@synergia-frontend/api';
import { SessionService } from '@synergia-frontend/services';

@Injectable()
export class ConnectorUpsertTag {
  private readonly fb = inject(NonNullableFormBuilder)
  private readonly sessionService = inject(SessionService)

  public form = this.fb.group({
    title: this.fb.control('', [Validators.required]),
    forProjects: this.fb.control(false),
    forAccounts: this.fb.control(false),
    forEvents: this.fb.control(false),
  })

  public getFormValue(): UpsertTagDto {
    const value = this.form.value;
    return {
      title: value.title ?? '',
      forAccounts: value.forAccounts ?? false,
      forEvents: value.forEvents ?? false,
      forProjects: value.forProjects ?? false,
      idTenant: this.sessionService.getTenantId() as number
    }
  }

  public setFormValue(res: TagDto) {
    const controls = this.form.controls
    controls.title.setValue(res.title)
    controls.forProjects.setValue(res.forProjects)
    controls.forEvents.setValue(res.forEvents)
    controls.forAccounts.setValue(res.forAccounts)
  }
}