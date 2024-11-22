import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { CommonFormFieldComponent } from '@synergia-frontend/ui';
import { LoginFacadeService } from './login-facade.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RegisterTenantDialogComponent } from './dialog/register-tenant-dialog.component';
import { IDoIdentifier, isBlankOrNull } from '@synergia-frontend/utils';

@Component({
  selector: 'lib-login',
  standalone: true,
  template: `
    <div
      #container
      id="route-container"
      [ngClass]="facade.useDarkMode() ? 'dark-mode' : ''"
    >
      <div id="container-for-system-options">
        <div
          *ngFor="let tenantOption of facade.getTenants()"
          class="tenant-option"
          [ngClass]="ngClassSelectedTenant(tenantOption)"
          (click)="onTenantSelected(tenantOption)"
        >
          {{ tenantOption.label }}
        </div>
        <div class="save-new-tenant" (click)="addNewTenant()">
          Salvar Tenant Novo
        </div>
      </div>

      <div id="container-for-login-form" *ngIf="facade.getTenantId()">
        <form>
          <lib-sy-common-form-field
            [control]="form.controls.email"
            [label]="'Email'"
          ></lib-sy-common-form-field>

          <lib-sy-common-form-field
            [control]="form.controls.password"
            [label]="'Senha'"
          ></lib-sy-common-form-field>
        </form>

        <div id="login-section">
          <button 
            mat-raised-button 
            (click)="login()"
            [disabled]="!formIsValid()"
          >Login</button>
          <div>Esqueci minha senha</div>
        </div>
      </div>
    </div>
  `,
  imports: [
    CommonModule,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    ReactiveFormsModule,
    CommonFormFieldComponent,
  ],
  providers: [LoginFacadeService],
  styleUrl: 'login-route.component.scss',
})
export class LoginRouteComponent implements AfterViewInit {
  @ViewChild('container') container!: ElementRef;

  /** Create Login Form **/
  public form: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;

  constructor(
    public readonly facade: LoginFacadeService,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog
  ) {
    this.form = this.createLoginFormGroup();
  }

  ngAfterViewInit() {
    this.facade.setup(this.container);
  }

  private createLoginFormGroup() {
    return this.fb.group({
      email: this.fb.control<string | null>(null, [Validators.required]),
      password: this.fb.control<string | null>(null, [Validators.required]),
    });
  }
  public formIsValid() {
    const form = this.form.value;
    return !isBlankOrNull(form.email) && !isBlankOrNull(form.password);
  }
  /** Handle Tenants **/
  onTenantSelected(tenant: IDoIdentifier) {
    this.facade.setTenant(tenant);
    if (tenant.id && this.container) {
      this.facade.getLoginPageConfigurationsOfTenantByTenantId(
        tenant.id,
        this.container
      );
    }
  }
  addNewTenant() {
    this.dialog.open(RegisterTenantDialogComponent);
  }
  /** Validate Login **/
  login() {
    const form = this.form.value;
    if (form.email == null || form.password == null) {
      return;
    } else {
      this.facade.authenticateUser(form.email, form.password);
    }
  }

  ngClassSelectedTenant(tenantOption: IDoIdentifier) {
    return tenantOption.id === this.facade.getTenantId()
      ? 'selected-tenant'
      : '';
  }
}
