import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routeLabels } from '@synergia-frontend/constants';
import { Router, RouterLink } from '@angular/router';
import { NavigationService } from '@synergia-frontend/services';

@Component({
  selector: 'lib-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div id="sidebar-container">
      <div id="sidebar-image">
      </div>
      
      <div id="sidebar-option-list">
        <ng-container *ngFor="let route of routes">
          <div 
            (click)="navigate(route.path)"
            [ngClass]="isRouteActive(route) ? 'active' : ''"
            class="sidebar-option">
            {{ route.label }}
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    :host {
        height: 100%;
        width: 240px;
        display: flex;
        background: white;
        border-left: 7px solid #474787;
    }
    #sidebar-container {
        height: 100%;
        width: 100%;
        border-right: 1px solid #323232;
        
        #sidebar-image {
            height: 160px;
            width: 240px;
            background: url("https://images.pexels.com/photos/2085998/pexels-photo-2085998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1");
            background-size: cover;   /* Ensure the image covers the entire div */
            background-position: center; /* Center the image within the div */
            background-repeat: no-repeat; /* Prevent the image from repeating */
        }
        #sidebar-option-list {
            padding: 8px;
            box-sizing: border-box;
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 8px;
            .sidebar-option {
                width: 100%;
                
                &.active {
                    font-weight: bold;
                }
            }
        }
    }
  `],
})
export class SidebarComponent {
  public routes = routeLabels

  constructor(
    private readonly navigationService: NavigationService
  ) {
  }
  navigate(path: string) {
    this.navigationService.navigate(path);
  }
  isRouteActive(route: { label: string; path: string }) {
    return this.navigationService.getActiveRoute() == route.path;
  }
}
