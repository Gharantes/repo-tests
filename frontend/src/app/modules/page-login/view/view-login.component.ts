import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { ConnectorLogin } from '../connector/connector-login';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormLoginComponent } from '../form/form-login.component';

@Component({
  selector: 'app-view-login',
  standalone: true,
  templateUrl: './view-login.component.html',
  styleUrl: './view-login.component.scss',
  providers: [],
  changeDetection: ChangeDetectionStrategy.Eager,
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

  @Output() public goToHomeEvent = new EventEmitter<void>();
  @Output() public attemptLoginEvent = new EventEmitter<void>();
  @Output() public retryTenantEvent = new EventEmitter<void>();

  /**
   * Só depende do tenant: a validade do formulário é conferida no clique. Com autofill do navegador
   * (Chrome/Opera), os valores só chegam ao formulário após uma interação do usuário — se o botão
   * dependesse de `form.valid`, ele ficaria desabilitado com os campos visualmente preenchidos.
   */
  public canSubmit(): boolean {
    return this.connector.tenant$() != null;
  }
  public submit() {
    if (!this.canSubmit()) {
      return;
    }
    const form = this.connector.form;
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    this.attemptLoginEvent.emit();
  }
}
