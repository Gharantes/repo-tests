import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { LayoutTopbarBeforeLoginComponent } from '../component-layout-topbar-before-login/layout-topbar-before-login.component';

@Component({
  selector: 'app-layout-before-login',
  standalone: true,
  templateUrl: './layout-before-login.component.html',
  styleUrl: `./layout-before-login.component.scss`,
  imports: [RouterOutlet, MatCardModule, LayoutTopbarBeforeLoginComponent],
})
export class LayoutBeforeLoginComponent {}