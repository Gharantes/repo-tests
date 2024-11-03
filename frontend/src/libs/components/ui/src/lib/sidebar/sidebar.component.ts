import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routeLabels } from '@synergia-frontend/constants';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'lib-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav>
      <ul>
        <li *ngFor="let route of routes">
          <div (click)="navigate(route.path)">
            {{ route.label }}
          </div>
        </li>
      </ul>
    </nav>
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
export class SidebarComponent {
  public routes = routeLabels

  constructor(
    private readonly router: Router,
  ) {
  }
  navigate(path: string) {
    this.router.navigate([path]).then()
  }
}
