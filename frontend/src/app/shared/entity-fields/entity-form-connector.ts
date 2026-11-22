import { WritableSignal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ITagModel } from '@synergia-frontend/interfaces';

/** Qual registro está sendo editado; muda o texto de apoio e o filtro das tags. */
export type EntityFormKind = 'project' | 'event';

/**
 * O que os campos de edição precisam de um connector. Projeto e evento têm os
 * mesmos campos de documento; cada connector pode ter controles a mais (idTenant etc.).
 */
export interface IEntityFormConnector {
  readonly form: {
    readonly valid: boolean;
    readonly controls: {
      readonly title: FormControl<string>;
      readonly description: FormControl<string>;
      readonly bannerUrl: FormControl<string | undefined>;
      readonly bannerColor: FormControl<string>;
      readonly tags: FormControl<ITagModel[]>;
    };
  };
  /** Última URL de banner que falhou ao carregar (compartilhada entre a capa e o campo da URL). */
  readonly brokenBannerUrl: WritableSignal<string | null>;
}
