import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ConnectorHome } from '../connector/connector-home';

@Component({
  selector: 'app-view-home',
  standalone: true,
  templateUrl: './view-home.component.html',
  styleUrl: './view-home.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatButtonModule,
  ],
})
export class ViewHomeComponent {
  @Input() public connector!: ConnectorHome;

  @Output() public goToTenantEvent = new EventEmitter<void>();
  @Output() public createTenantEvent = new EventEmitter<void>();

  public submit() {
    if (this.connector.form.valid) {
      this.goToTenantEvent.emit();
    }
  }
}
