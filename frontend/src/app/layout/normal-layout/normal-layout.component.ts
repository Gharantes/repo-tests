import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { LayoutTopbarComponent } from "../components/topbar/layout-topbar.component";
import { LayoutSidebarComponent } from "../components/sidebar/layout-sidebar.component";
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
  styleUrl: `./style.scss`,
  imports: [
    RouterOutlet,
    LayoutTopbarComponent,
    LayoutSidebarComponent,
    MatCardModule
  ]
})
export class NormalLayoutComponent {

}