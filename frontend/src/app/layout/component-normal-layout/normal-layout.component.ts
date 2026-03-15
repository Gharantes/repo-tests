import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { LayoutTopbarComponent } from "../component-layout-topbar/layout-topbar.component";
import { LayoutSidebarComponent } from "../component-layout-sidebar/layout-sidebar.component";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-normal-layout',
  standalone: true,
  template: `
    <app-layout-topbar></app-layout-topbar>

    <div id="page" class="h-full">
        <app-layout-sidebar></app-layout-sidebar>

        <div id="page-container">
          <mat-card [appearance]="'outlined'" id="card">
            <router-outlet id="router-outlet"></router-outlet>
          </mat-card>
        </div>
    </div>
  `,
  styleUrl: `./normal-layout.component.scss`,
  imports: [
    RouterOutlet,
    LayoutTopbarComponent,
    LayoutSidebarComponent,
    MatCardModule
  ]
})
export class NormalLayoutComponent {

}