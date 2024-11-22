import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AuthenticationService,
  NavigationService,
} from '@synergia-frontend/services';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  faBell,
  faEllipsisVertical,
  faGear,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'lib-topbar',
  standalone: true,
  imports: [
    CommonModule,
    MatButton,
    FaIconComponent,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
  ],
  template: `
    <div id="top-bar-container">
      <div id="left">
        <div id="title">Synergia</div>
      </div>

      <div id="right">
        <button mat-icon-button class="top-bar-button">
          <fa-icon [icon]="faGear"></fa-icon>
        </button>

        <div id="user-info">
          <div id="user-name">Guilherme Arantes</div>
          
          <div id="user-profile-picture">
            <fa-icon [icon]="faUser"></fa-icon>
          </div>
        </div>
        
        
        <button
          mat-icon-button
          class="top-bar-button"
          [matMenuTriggerFor]="optionMenu"
          [color]="'white'">
          <fa-icon [icon]="faEllipsisVertical"></fa-icon>
        </button>

        <mat-menu #optionMenu="matMenu">
          <button mat-menu-item (click)="logout()">Logout</button>
        </mat-menu>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        min-height: 55px;
        height: 55px;
        max-height: 55px;
        width: 100%;
        background: #3f51b5;
        color: white;
      }
      #top-bar-container {
        height: 100%;

        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        box-sizing: border-box;
        padding-left: 10px;
        padding-right: 10px;

        #left {
          #title {
            font-family: 'Nova Slim', sans-serif;
          }
        }
        #right {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
            
            #user-info {
                display: flex; 
                align-items: center;
                gap: 12px;
                #user-name {
                    
                }
                #user-profile-picture {
                    background: cornflowerblue;
                    border-radius: 50%;
                    padding: 8px 12px;
                    box-sizing: border-box;
                }
            }

          .top-bar-button {
              color: white;
          }
        }
      }
    `,
  ],
})
export class TopbarComponent {
  isOptionMenuOpen = signal(false);

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly navigationService: NavigationService
  ) {}

  logout() {
    this.authenticationService.updateAuthenticated(false);
    this.navigationService.navigateToLogin();
  }

  protected readonly faGear = faGear;
  protected readonly faBell = faBell;
  protected readonly faEllipsisVertical = faEllipsisVertical;
  protected readonly faUser = faUser;
}
