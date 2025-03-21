import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RoutingService } from '@synergia-frontend/services';

@Component({
  selector: 'app-login-route',
  standalone: true,
  templateUrl: 'index.html',
  styleUrl: 'style.scss',
  providers: [],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRippleModule
  ],
})
export class LoginRouteComponent {
  private readonly fb = inject(FormBuilder);
  private readonly routingService = inject(RoutingService);

  public readonly form: FormGroup<{
    tenant: FormControl<string | null>,
    user: FormControl<string | null>;
    password: FormControl<string | null>;
  }> = this.fb.group({
    user: this.fb.control<string | null>(null),
    password: this.fb.control<string | null>(null),
    tenant: this.fb.control<string | null>(null)
  });

  public attemptLogin() {
    this.routingService.goTo(this.routingService.dashboard())
  }
}
