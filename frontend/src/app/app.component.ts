import { AfterViewInit, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { SidebarComponent, TopbarComponent } from '@synergia-frontend/ui';
import { AuthenticationService } from '@synergia-frontend/services';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <div id="layout-container">
      <lib-topbar *ngIf="authorizationService.getAuthenticated()"></lib-topbar>
      <div id="main-container">
        <lib-sidebar *ngIf="authorizationService.getAuthenticated()"></lib-sidebar>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrl: `./app.component.scss`,
  imports: [RouterModule, MatButton, SidebarComponent, TopbarComponent, NgIf],
})
export class AppComponent implements AfterViewInit {
  title = 'synergia-frontend';

  constructor(
    private readonly router: Router,
    public readonly authorizationService: AuthenticationService
  ) {}

  ngAfterViewInit() {
    this.checkAuthentication();
  }

  private checkAuthentication() {
    if (!this.authorizationService.getAuthenticated()) {
      this.navigateToLogin();
    }
  }

  private navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
