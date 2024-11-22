import { AfterViewInit, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent, TopbarComponent } from '@synergia-frontend/ui';
import {
  AuthenticationService,
  NavigationService,
  TenantsService,
} from '@synergia-frontend/services';
import { NgIf } from '@angular/common';
import { tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <div id="layout-container">
      <lib-topbar *ngIf="authorizationService.getAuthenticated()"></lib-topbar>
      <div id="main-container">
        <lib-sidebar
          *ngIf="authorizationService.getAuthenticated()"
        ></lib-sidebar>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrl: `./app.component.scss`,
  imports: [RouterModule, SidebarComponent, TopbarComponent, NgIf],
})
export class AppComponent implements AfterViewInit {
  title = 'synergia-frontend';

  constructor(
    public readonly authorizationService: AuthenticationService,
    public readonly navigationService: NavigationService,
    private readonly tenantsService: TenantsService
  ) {}

  ngAfterViewInit() {
    this.navigationService
      .navigationListener()
      .pipe(
        tap((route) => {
          if (route.url == '/tenants') {
            console.log('PASSWORD CHECK THIS LATER');
          } else {
            this.checkSessionAuthentication();
          }
        })
      )
      .subscribe();
  }

  private checkSessionAuthentication() {
    const authenticated = this.authorizationService.getAuthenticated();
    let idTenant = this.tenantsService.getTenantId();

    /** If not authenticated, send user to login page **/
    if (!authenticated) {
      this.navigationService.navigateToLogin();
      return;
    }
    /** If no Tenant selected, see if latest exists in Local Storage,
     * and set it as active */
    if (idTenant == null) {
      this.tenantsService.setTenantsFromLocalStorage();
      this.tenantsService.setTenantFromLocalStorage();
      idTenant = this.tenantsService.getTenantId();
      /** If no Tenant selected even then, send user to login page **/
      if (idTenant == null) {
        this.navigationService.navigateToLogin();
        return;
      }
    }
    return;
  }
}
