import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { LayoutTopbarComponent } from "../component-layout-topbar/layout-topbar.component";
import { LayoutSidebarComponent } from "../component-layout-sidebar/layout-sidebar.component";
import { MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-normal-layout',
  standalone: true,
  templateUrl: './normal-layout.component.html',
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