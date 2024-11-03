import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService, NavigationService } from '@synergia-frontend/services';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'lib-topbar',
  standalone: true,
  imports: [CommonModule, MatButton],
  template: `
    <div id="top-bar-container">
      <div>Synergia</div>

      <div>Guilherme Arantes</div>

      <button mat-raised-button (click)="logout()">Sair</button>
    </div>
  `,
  styles: [
    `
      :host {
        height: 55px;
        width: 100%;
        background: green;
      }
      #top-bar-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
    `,
  ],
})
export class TopbarComponent {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly navigationService: NavigationService
  ) {}

  logout() {
    this.authenticationService.updateAuthenticated(false);
    this.navigationService.navigateToLogin();
  }
}
