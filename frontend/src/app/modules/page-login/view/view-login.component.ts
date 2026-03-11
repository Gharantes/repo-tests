import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConnectorLogin } from '../connector/connector-login';
import { ReactiveFormsModule } from '@angular/forms';
import { TenantPickerComponent } from '../component-tenant-picker/tenant-picker.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ITenantModel } from '@synergia-frontend/interfaces';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-view-login',
  standalone: true,
  templateUrl: './view-login.component.html',
  styleUrl: './view-login.component.scss',
  providers: [],
  imports: [
    ReactiveFormsModule,
    TenantPickerComponent,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
  ],
})
export class ViewLoginComponent {
  @Input() public tenants$!: ITenantModel[];
  @Input() public tenantSelected!: ITenantModel | null;
  @Input() public connector!: ConnectorLogin;

  @Output() public createTenantEvent = new EventEmitter<void>();
  @Output() public attemptLoginEvent = new EventEmitter<void>();
  @Output() public selectTenantEvent = new EventEmitter<ITenantModel>();
}
