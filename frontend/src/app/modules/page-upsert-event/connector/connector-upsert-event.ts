import { inject, Injectable, signal } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import {
  IEventModel,
  ITagModel,
  IUpsertEventModel,
} from '@synergia-frontend/interfaces';
import { SessionService } from '@synergia-frontend/services';
import { randomBannerColor } from '@synergia-frontend/utils';

@Injectable()
export class ConnectorUpsertEvent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly sessionService = inject(SessionService);

  public readonly form = this.fb.group({
    idAccount: this.fb.control<number>(
      this.sessionService.getUserId() as number
    ),
    idTenant: this.fb.control<number>(
      this.sessionService.getTenantId() as number
    ),
    title: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required]),
    bannerUrl: this.fb.control<string | undefined>(undefined),
    /** Cor do banner quando não há imagem; um novo registro já começa com uma cor da paleta. */
    bannerColor: this.fb.control<string>(randomBannerColor()),
    tags: this.fb.control<ITagModel[]>([]),
  });

  /** Última URL de banner que falhou ao carregar (compartilhada entre a capa e o campo da URL). */
  public readonly brokenBannerUrl = signal<string | null>(null);

  public getFormValue(): IUpsertEventModel | null {
    const v = this.form.value;
    if (
      v.title == null ||
      v.description == null ||
      v.idAccount == null ||
      v.idTenant == null
    ) {
      return null;
    }
    return {
      idAccount: v.idAccount,
      idTenant: v.idTenant,
      description: v.description,
      title: v.title,
      bannerUrl: v.bannerUrl,
      bannerColor: v.bannerColor,
      tags: v.tags?.map(v => v.id) ?? [],
    };
  }
  public populateForm(res: IEventModel) {
    this.brokenBannerUrl.set(null);
    this.form.controls.title.setValue(res.title);
    this.form.controls.description.setValue(res.description);
    this.form.controls.bannerUrl.setValue(res.bannerUrl);
    if (res.bannerColor) this.form.controls.bannerColor.setValue(res.bannerColor);
    this.form.controls.tags.setValue(res.tags)
  }
}