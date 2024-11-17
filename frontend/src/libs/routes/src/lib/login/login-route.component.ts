import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonFormFieldComponent } from '@synergia-frontend/ui';
import { AuthenticationService, TenantsService } from '@synergia-frontend/services';
import { LoginFacadeService } from './login-facade.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RegisterTenantDialogComponent } from './dialog/register-tenant-dialog.component';

@Component({
  selector: 'lib-login',
  standalone: true,
  template: `
    <div
      #container
      id="route-container"
      *ngIf="{ 
        textHex: facade.loginPageConfigurationSignal()?.textHex ?? 'black',
      } as style"
    >
      <div id="container-for-system-options" class="abs-top-right">
        <div
          *ngIf="tenantsService.selectedTenant() as tenant"
          id="sistema-selecionado"
          [ngStyle]="{ color: style.textHex, 'border-color': style.textHex }">
          {{ tenant.label }}
        </div>
        <div id="lista-sistemas">
          <div
            *ngFor="let tenantOption of tenantsService.tenants()"
            class="sistema-option"
            [ngStyle]="{ color: style.textHex, 'border-color': style.textHex }">
            {{ tenantOption.label }}
          </div>
          <div
            class="login-em-novo-sistema"
            (click)="addNewTenant()"
            [ngStyle]="{ color: style.textHex, 'border-color': style.textHex }">
            Salvar Tenant Novo
          </div>
        </div>
      </div>

      <div
        id="container-for-login-form"
        [ngStyle]="{ 'border-color': style.textHex }"
      >
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
            [disabled]="!tenantsService.selectedTenant()"
            (click)="login()"
          >
            Login
          </button>
          <div [ngStyle]="{ color: style.textHex }">Esqueci minha senha</div>
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
export class LoginRouteComponent {
  @ViewChild('container') container!: ElementRef;

  constructor(
    public readonly facade: LoginFacadeService,
    public readonly tenantsService: TenantsService,
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
  ) {
    this.tenantsService.setTenantsFromLocalStorage();
    this.form = this.createLoginFormGroup();
  }

  /** Create Login Form **/
  public form: FormGroup<{
    email: FormControl<null>;
    password: FormControl<null>;
  }>;
  private createLoginFormGroup() {
    return this.fb.group({
      email: this.fb.control(null),
      password: this.fb.control(null),
    });
  }

  /** Handle Tenants **/
  onTenantSelected() {
    console.log('Tenant Selected');
  }

  /** Validate Login **/
  login() {
    if (!this.tenantsService.selectedTenant()) {
      return;
    }
    this.authenticationService.updateAuthenticated(true);
    this.navigateToHome();
  }
  navigateToHome() {
    this.router.navigate(['/home']).then();
  }

  addNewTenant() {
    this.dialog.open(RegisterTenantDialogComponent);
  }
}
