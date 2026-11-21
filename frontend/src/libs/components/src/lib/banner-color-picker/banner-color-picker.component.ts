import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BANNER_COLORS } from '@synergia-frontend/utils';

/** Botão que abre um menu com a paleta de cores do banner (usada quando não há imagem). */
@Component({
  selector: 'lib-banner-color-picker',
  standalone: true,
  templateUrl: './banner-color-picker.component.html',
  styleUrl: './banner-color-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIconModule, MatMenuModule],
})
export class BannerColorPickerComponent {
  @Input() color: string | undefined;
  @Output() colorChange = new EventEmitter<string>();

  protected readonly colors = BANNER_COLORS;

  protected isSelected(hex: string): boolean {
    return hex.toLowerCase() === (this.color ?? '').toLowerCase();
  }

  protected get label(): string {
    return this.colors.find((c) => this.isSelected(c.hex))?.label ?? 'Escolher cor';
  }

  protected pick(hex: string) {
    this.colorChange.emit(hex);
  }
}
