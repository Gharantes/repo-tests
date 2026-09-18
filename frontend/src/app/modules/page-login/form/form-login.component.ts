import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, signal } from '@angular/core';
import { ConnectorLogin } from '../connector/connector-login';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-form-login',
  standalone: true,
  templateUrl: './form-login.component.html',
  styleUrl: './form-login.component.scss',
  providers: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class FormLoginComponent {
  @Input() public connector!: ConnectorLogin;
  @Output() public submitEvent = new EventEmitter<void>();
  public readonly hidePassword = signal(true);
}
