import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConnectorLogin } from '../connector/connector-login';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ITenantModel } from '@synergia-frontend/interfaces';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormLoginComponent } from '../form/form-login.component';

@Component({
  selector: 'app-view-login',
  standalone: true,
  templateUrl: './view-login.component.html',
  styleUrl: './view-login.component.scss',
  providers: [],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatButtonModule,
    FormLoginComponent,
  ],
})
export class ViewLoginComponent {
  @Input() public connector!: ConnectorLogin;

  @Output() public createTenantEvent = new EventEmitter<void>();
  @Output() public attemptLoginEvent = new EventEmitter<void>();
}
