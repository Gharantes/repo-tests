import { Component, inject, ChangeDetectionStrategy, signal, Output, EventEmitter } from '@angular/core';
import { RoutingService, SnackbarService } from '@synergia-frontend/services';
import { EntityTenantResourceService, TenantDto } from '@synergia-frontend/api';
import { catchError, EMPTY, finalize } from 'rxjs';
import { ConnectorListTenants } from './connector/connector-list-tenants';
import { ViewListTenantsPasswordComponent } from './view/view-list-tenants-password.component';
import { ViewListTenantsComponent } from './view/view-list-tenants.component';

/** Pede a senha (LIST_TENANT_PAGE_PASSWORD no backend) antes de mostrar a lista. */
@Component({
  selector: 'app-route-list-tenants',
  standalone: true,
  templateUrl: './route-list-tenants.component.html',
  styleUrl: './route-list-tenants.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [ConnectorListTenants],
  imports: [ViewListTenantsPasswordComponent, ViewListTenantsComponent],
})
export class RouteListTenantsComponent {
  public readonly connector = inject(ConnectorListTenants);
  public readonly routingService = inject(RoutingService);
  private readonly snackService = inject(SnackbarService);
  private readonly entityTenantService = inject(EntityTenantResourceService);

  public readonly isUnlocked = signal(false);
  public readonly isSubmitting = signal(false);
  public readonly tenants = signal<TenantDto[]>([]);

  @Output() public goBackEvent = new EventEmitter<void>();

  public checkPassword() {
    if (this.isSubmitting()) {
      return;
    }
    this.isSubmitting.set(true);

    this.entityTenantService
      .checkListTenantsPassword({ password: this.connector.form.controls.password.value })
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: (isValid) => {
          if (isValid) {
            this.isUnlocked.set(true);
            this.loadTenants();
          } else {
            this.snackService.showMessage('Senha incorreta.', true, 'error');
            this.goBackEvent.emit();
          }
        },
        error: (err) => {
          this.snackService.catchError(err, 'Erro ao verificar a senha.');
          this.goBackEvent.emit();
        },
      });
  }

  private loadTenants() {
    this.entityTenantService
      .listAllTenants()
      .pipe(
        catchError((err) => {
          this.snackService.catchError(err, 'Erro ao listar tenants.');
          return EMPTY;
        })
      )
      .subscribe((tenants) => this.tenants.set(tenants));
  }
}
