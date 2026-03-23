import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SnackbarService } from '@synergia-frontend/services';

@Component({
  selector: 'app-root',
  standalone: true,
  template: ` <router-outlet></router-outlet> `,
  styleUrl: `./app.component.scss`,
  imports: [RouterModule],
})
export class AppComponent {
  constructor(private readonly snackbarService: SnackbarService) {
    this.snackbarService.initializeStackedSnackbarsComponent();
  }
}
