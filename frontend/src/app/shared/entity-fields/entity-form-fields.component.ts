import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ITagModel } from '@synergia-frontend/interfaces';
import { AddTagBtnComponent, BannerColorPickerComponent } from '@synergia-frontend/components';
import { EntityFormKind, IEntityFormConnector } from './entity-form-connector';

const PALETTE = ['#3B52CC', '#FF7043', '#16A34A', '#9333EA', '#0891B2', '#DB2777', '#CA8A04', '#4F46E5'];

/**
 * Campos de projeto/evento no estilo documento (título grande, propriedades, texto corrido).
 * Usados nas telas de criar e nas páginas de detalhes, em modo edição.
 * O host é `display: contents`, então os campos entram direto no fluxo do `.doc` de quem usa.
 */
@Component({
  selector: 'app-entity-form-fields',
  templateUrl: './entity-form-fields.component.html',
  styleUrl: './entity-form-fields.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, MatIconModule, AddTagBtnComponent, BannerColorPickerComponent],
})
export class EntityFormFieldsComponent {
  @Input() public connector!: IEntityFormConnector;
  @Input() public kind: EntityFormKind = 'project';
  /** Mostra as tags sem deixar mudar (quem edita sem ser membro e sem ASSIGN_TAGS_*). */
  @Input() public tagsLocked = false;

  public get descriptionPlaceholder(): string {
    return this.kind === 'event'
      ? 'Descreva o evento: o que vai acontecer, para quem é, quando e onde...'
      : 'Descreva o projeto: objetivo, quem pode participar, o que já foi feito...';
  }

  protected get c() {
    return this.connector.form.controls;
  }

  public get bannerColor(): string {
    return this.c.bannerColor.value;
  }

  public setBannerColor(hex: string) {
    this.c.bannerColor.setValue(hex);
  }

  public get bannerUrl(): string {
    return (this.c.bannerUrl.value ?? '').trim();
  }

  public get imageBroken(): boolean {
    return !!this.bannerUrl && this.bannerUrl === this.connector.brokenBannerUrl();
  }

  public clearBanner() {
    this.c.bannerUrl.setValue(undefined);
  }

  public tagColor(tag: ITagModel): string {
    return PALETTE[Math.abs(tag.id) % PALETTE.length];
  }

  public addTag(tag: ITagModel) {
    const control = this.c.tags;
    if (control.value.some((v) => v.id === tag.id)) return;
    control.setValue([...control.value, tag]);
  }

  public removeTag(tag: ITagModel) {
    const control = this.c.tags;
    control.setValue(control.value.filter((v) => v.id !== tag.id));
  }
}
