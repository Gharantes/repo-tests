import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { PermissionsPageStore } from './permissions-page.store';
import { TabAccountsComponent } from './tab-accounts/tab-accounts.component';
import { TabProfilesComponent } from './tab-profiles/tab-profiles.component';

/**
 * Página de Permissões, em duas abas:
 * - Usuários: quais perfis e quais permissões avulsas cada pessoa tem;
 * - Perfis: conjuntos de permissões com nome (ex.: "Aluno"), reaproveitados entre usuários.
 * Quem não tem MANAGE_PERMISSIONS vê tudo, mas não muda nada.
 */
@Component({
  selector: 'app-route-list-permissions',
  standalone: true,
  templateUrl: './route-list-permissions.component.html',
  styleUrl: `./route-list-permissions.component.scss`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIconModule, MatTabsModule, TabAccountsComponent, TabProfilesComponent],
  providers: [PermissionsPageStore],
})
export class RouteListPermissionsComponent {
  public readonly store = inject(PermissionsPageStore);
}
