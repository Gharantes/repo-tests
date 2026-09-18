import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConnectorListTenants } from '../connector/connector-list-tenants';

@Component({
  selector: 'app-view-list-tenants-password',
  standalone: true,
  templateUrl: './view-list-tenants-password.component.html',
  styleUrl: './view-list-tenants.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, MatButtonModule, MatRippleModule, MatFormFieldModule, MatInputModule],
})
export class ViewListTenantsPasswordComponent {
  @Input() public connector!: ConnectorListTenants;
  @Input() public isSubmitting = false;

  @Output() public submitEvent = new EventEmitter<void>();
  @Output() public goBackEvent = new EventEmitter<void>();

  public canSubmit() {
    return this.connector.form.valid && !this.isSubmitting;
  }
  public submit() {
    if (this.canSubmit()) {
      this.submitEvent.emit();
    }
  }
}
