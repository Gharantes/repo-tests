import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Snackbar2Service } from '@synergia-frontend/services';

@Component({
  selector: 'app-root',
  standalone: true,
  template: ` <router-outlet></router-outlet> `,
  styleUrl: `./app.component.scss`,
  imports: [RouterModule],
})
export class AppComponent {
  constructor(private readonly snackbarService: Snackbar2Service) {
    this.snackbarService.initializeStackedSnackbarsComponent();
  }
}
