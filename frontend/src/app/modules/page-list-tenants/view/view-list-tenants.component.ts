import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { TenantDto } from '@synergia-frontend/api';

@Component({
  selector: 'app-view-list-tenants',
  standalone: true,
  templateUrl: './view-list-tenants.component.html',
  styleUrl: './view-list-tenants.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatButtonModule, MatRippleModule, MatIconModule],
})
export class ViewListTenantsComponent {
  @Input() public tenants: TenantDto[] = [];
  @Input() public deletingId: number | null = null;

  /** Tenant cuja exclusão está esperando confirmação. */
  public readonly confirmingId = signal<number | null>(null);

  /** Emite o identifier do tenant escolhido. */
  @Output() public goToTenantEvent = new EventEmitter<string>();
  @Output() public deleteTenantEvent = new EventEmitter<TenantDto>();
  @Output() public goBackEvent = new EventEmitter<void>();

  public confirmDelete(tenant: TenantDto) {
    this.confirmingId.set(null);
    this.deleteTenantEvent.emit(tenant);
  }
}
