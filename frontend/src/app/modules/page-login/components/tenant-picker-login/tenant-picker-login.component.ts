import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { IDoLoginTenantInformation } from '@synergia-frontend/interfaces';
import { RoutingService } from '@synergia-frontend/services';

@Component({
  selector: 'app-tenant-picker-login',
  standalone: true,
  templateUrl: 'index.html',
  styleUrl: 'style.scss',
  imports: [MatRipple],
})
export class TenantPickerLoginComponent {
  @Input() public tenants: IDoLoginTenantInformation[] = [];
  @Output() setNewTenant = new EventEmitter<IDoLoginTenantInformation>();

  constructor(private readonly routingService: RoutingService) {}

  public selecionarTenant($event: IDoLoginTenantInformation) {
    this.setNewTenant.emit($event);
  }
  public createTenant() {
    this.routingService.goTo(this.routingService.goToCreateTenant());
  }
}