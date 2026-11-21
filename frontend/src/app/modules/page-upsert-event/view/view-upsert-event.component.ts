import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ITagModel } from '@synergia-frontend/interfaces';
import { AddTagBtnComponent, BannerColorPickerComponent } from '@synergia-frontend/components';
import { ConnectorUpsertEvent } from '../connector/connector-upsert-event';

const PALETTE = ['#3B52CC', '#FF7043', '#16A34A', '#9333EA', '#0891B2', '#DB2777', '#CA8A04', '#4F46E5'];

/** Criar/editar evento no estilo documento: capa opcional, título grande, propriedades e texto corrido. */
@Component({
  selector: 'app-view-upsert-event',
  standalone: true,
  templateUrl: './view-upsert-event.component.html',
  styleUrl: './view-upsert-event.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule, AddTagBtnComponent, BannerColorPickerComponent],
})
export class ViewUpsertEventComponent {
  @Input() public connector!: ConnectorUpsertEvent;
  @Input() public editing = false;

  @Output() public readonly goToParentPageEvent = new EventEmitter<void>();
  @Output() public readonly salvarEvent = new EventEmitter<void>();

  /** Última URL de banner que falhou ao carregar; muda de URL, tenta de novo. */
  private brokenUrl: string | null = null;

  protected get c() {
    return this.connector.form.controls;
  }

  public get title(): string {
    return this.c.title.value.trim();
  }

  public get initial(): string {
    return (this.title[0] ?? '#').toUpperCase();
  }

  /** Cor de fundo da capa; aparece sozinha quando não há imagem. */
  public get bannerColor(): string {
    return this.c.bannerColor.value;
  }

  public setBannerColor(hex: string) {
    this.c.bannerColor.setValue(hex);
  }

  public get bannerUrl(): string {
    return (this.c.bannerUrl.value ?? '').trim();
  }

  public get showImage(): boolean {
    return !!this.bannerUrl && this.bannerUrl !== this.brokenUrl;
  }

  public get imageBroken(): boolean {
    return !!this.bannerUrl && this.bannerUrl === this.brokenUrl;
  }

  public onImageError() {
    this.brokenUrl = this.bannerUrl;
  }

  public clearBanner() {
    this.c.bannerUrl.setValue(undefined);
  }

  public get descLength(): number {
    return this.c.description.value.length;
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

  public save() {
    if (this.connector.form.valid) this.salvarEvent.emit();
  }
}
