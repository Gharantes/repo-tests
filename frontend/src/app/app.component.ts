import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SessionService } from '@synergia-frontend/services';

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
    private readonly sessionService: SessionService 
  ) {}
}
