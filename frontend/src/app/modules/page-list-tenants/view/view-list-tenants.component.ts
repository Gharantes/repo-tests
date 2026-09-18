import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { TenantDto } from '@synergia-frontend/api';

@Component({
  selector: 'app-view-list-tenants',
  standalone: true,
  templateUrl: './view-list-tenants.component.html',
  styleUrl: './view-list-tenants.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatButtonModule, MatRippleModule],
})
export class ViewListTenantsComponent {
  @Input() public tenants: TenantDto[] = [];

  /** Emite o identifier do tenant escolhido. */
  @Output() public goToTenantEvent = new EventEmitter<string>();
  @Output() public goBackEvent = new EventEmitter<void>();
}
