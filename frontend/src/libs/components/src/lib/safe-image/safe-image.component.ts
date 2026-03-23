import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-safe-image',
  templateUrl: `safe-image.component.html`,
  styleUrl: 'safe-image.component.scss',
  imports: [CommonModule],
  standalone: true,
})
export class SafeImageComponent {
  @Input() url?: string;
  @Input() altColor!: string;

  public errorOnLoadingImage = false;

  public hasValidImage(): boolean {
    return !(this.url == null) && !(this.url === '');
  }
  public errorOnLoad() {
    this.errorOnLoadingImage = true
  }
}