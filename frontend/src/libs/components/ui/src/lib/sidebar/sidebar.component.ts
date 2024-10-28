import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
  SIDEBAR
  `,
  styles: [`
    :host {
        height: 100%;
        width: 250px;
        display: flex;
        background: red;
    }
  `],
})
export class SidebarComponent {}
