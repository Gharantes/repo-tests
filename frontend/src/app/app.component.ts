import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AuthenticationService,
  NavigationService,
} from '@synergia-frontend/services';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrl: `./app.component.scss`,
  imports: [RouterModule],
})
export class AppComponent {
  title = 'synergia-frontend';

  constructor(
    public readonly authorizationService: AuthenticationService,
    public readonly navigationService: NavigationService,
  ) {}
}
