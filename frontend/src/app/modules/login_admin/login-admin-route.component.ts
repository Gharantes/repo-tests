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

@Component({
  selector: 'app-login-admin-route',
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
export class LoginAdminRouteComponent {
  private readonly fb = inject(FormBuilder);


  public readonly form: FormGroup<{
    tenant: FormControl<string | null>,
    user: FormControl<string | null>;
    password: FormControl<string | null>;
  }> = this.fb.group({
    user: this.fb.control<string | null>(null),
    password: this.fb.control<string | null>(null),
    tenant: this.fb.control<string | null>(null)
  });
}
