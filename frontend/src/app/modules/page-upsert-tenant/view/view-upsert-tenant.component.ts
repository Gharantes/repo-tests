import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IUpsertTenantModel } from '@synergia-frontend/interfaces';
import { ConnectorCreateTenant } from '../connector/connector-create-tenant';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-view-upsert-tenant',
  standalone: true,
  templateUrl: './view-upsert-tenant.component.html',
  styleUrl: './view-upsert-tenant.component.scss',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCheckbox,
  ],
})
export class ViewUpsertTenantComponent {
  @Input() connector!: ConnectorCreateTenant;

  @Output() goToParentPageEvent = new EventEmitter<void>();
  @Output() registerEntityEvent = new EventEmitter<void>();

  public isFormValid() {
    return this.connector.form.valid;
  }
  public registrarTenant() {
    this.registerEntityEvent.emit();
  }
}
