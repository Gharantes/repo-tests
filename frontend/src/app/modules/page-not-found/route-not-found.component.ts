import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RoutingService, SessionService } from '@synergia-frontend/services';

@Component({
  selector: 'app-route-not-found',
  standalone: true,
  templateUrl: './route-not-found.component.html',
  styleUrl: './route-not-found.component.scss',
  providers: [],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRippleModule,
  ],
})
export class RouteNotFoundComponent {
  private readonly sessionService = inject(SessionService)
  private readonly routingService = inject(RoutingService)

  constructor() {
    const id = this.sessionService.getUserId()
    if (id == undefined) {
      this.routingService.goToLogin()
    } else {
      this.routingService.goToDashboard()
    }
  }
}
