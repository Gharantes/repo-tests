import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'lib-extra-view',
  standalone: true,
  imports: [CommonModule, MatButton],
  template: ` 
    <div>
      {{ counter }}
      <button mat-raised-button (click)="addToCount()">Incrementar</button>
      <button mat-raised-button (click)="resetCount()">Reset</button>
    </div>
  `,
  styles: [``],
})
export class ExtraViewComponent {
  @Input() counter!: number;

  @Output() addToCountEvent = new EventEmitter<void>();
  addToCount() {
    this.addToCountEvent.emit()
  }
  @Output() resetCountEvent = new EventEmitter<void>();
  resetCount() {
    this.resetCountEvent.emit()
  }
}
