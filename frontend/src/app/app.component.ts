import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SessionService, Snackbar2Service } from '@synergia-frontend/services';

@Component({
    selector: 'app-root',
    template: `
      <router-outlet></router-outlet>
    `,
    styleUrl: `./app.component.scss`,
    imports: [RouterModule]
})
export class AppComponent {
  constructor (
    private readonly snackbarService: Snackbar2Service
  ) {
    this.snackbarService.initializeStackedSnackbarsComponent();
  }
}
