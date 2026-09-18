
import { Component, EventEmitter, inject, Input, Output, ChangeDetectionStrategy, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IUpsertTenantModel } from '@synergia-frontend/interfaces';
import { ConnectorCreateTenant } from '../connector/connector-create-tenant';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-view-upsert-tenant',
  standalone: true,
  templateUrl: './view-upsert-tenant.component.html',
  styleUrl: './view-upsert-tenant.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCheckbox,
    MatRippleModule,
],
})
export class ViewUpsertTenantComponent {
  @Input() connector!: ConnectorCreateTenant;
  public readonly hidePassword = signal(true);

  @Output() goToParentPageEvent = new EventEmitter<void>();
  @Output() registerEntityEvent = new EventEmitter<void>();

  public isFormValid() {
    return this.connector.form.valid;
  }
  public registrarTenant() {
    this.registerEntityEvent.emit();
  }
}
