import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    TOPBAR
  `,
  styles: [`
    :host {
        height: 75px;
        width: 100%;
        background: green;
    }
  `],
})
export class TopbarComponent {}
