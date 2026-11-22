import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ConnectorUpsertProject } from '../connector/connector-upsert-project';

/** Capa do projeto em edição: mostra a imagem da URL digitada ou a cor do banner com a inicial. */
@Component({
  selector: 'app-project-cover-field',
  template: `
    <div class="cover" [style.background]="bannerColor">
      @if (showImage) {
        <img [src]="bannerUrl" alt="" (error)="connector.brokenBannerUrl.set(bannerUrl)" />
      } @else {
        <span class="monogram">{{ initial }}</span>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .cover {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      overflow: hidden;
      transition: background .3s;
      img { width: 100%; height: 100%; object-fit: cover; }
    }
    .monogram { font-size: 72px; font-weight: 800; color: rgba(255, 255, 255, .85); }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ProjectCoverFieldComponent {
  @Input() public connector!: ConnectorUpsertProject;

  public get bannerColor(): string {
    return this.connector.form.controls.bannerColor.value;
  }

  public get bannerUrl(): string {
    return (this.connector.form.controls.bannerUrl.value ?? '').trim();
  }

  public get showImage(): boolean {
    return !!this.bannerUrl && this.bannerUrl !== this.connector.brokenBannerUrl();
  }

  public get initial(): string {
    return (this.connector.form.controls.title.value.trim()[0] ?? '#').toUpperCase();
  }
}
