import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { ITenantModel } from '@synergia-frontend/interfaces';

@Component({
  selector: 'app-tenant-picker',
  standalone: true,
  templateUrl: 'tenant-picker.component.html',
  styleUrl: 'tenant-picker.component.scss',
  imports: [MatRipple],
})
export class TenantPickerComponent {
  @Input() public tenants: ITenantModel[] = [];
  @Output() public selectTenantEvent = new EventEmitter<ITenantModel>();
  @Output() public createTenantEvent = new EventEmitter<void>();
}