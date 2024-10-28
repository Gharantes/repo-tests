import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { SidebarComponent, TopbarComponent } from '@synergia-frontend/ui';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <div id="layout-container">
      <lib-topbar></lib-topbar>
      <div id="main-container">
        <lib-sidebar></lib-sidebar>
        <router-outlet></router-outlet>
      </div>
    </div>

  `,
  styleUrl: `./app.component.scss`,
  imports: [RouterModule, MatButton, SidebarComponent, TopbarComponent],
})
export class AppComponent {
  title = 'synergia-frontend';
}
