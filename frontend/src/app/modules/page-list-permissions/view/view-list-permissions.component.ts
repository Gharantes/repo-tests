import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IAccountModel, IPermissionModel } from '@synergia-frontend/interfaces';
import { ConnectorListPermissions } from '../connector/connector-list-permissions';

const PALETTE = ['#3B52CC', '#FF7043', '#16A34A', '#9333EA', '#0891B2', '#DB2777', '#CA8A04', '#4F46E5'];

/** Ordem em que os grupos aparecem; categorias novas vão para o fim. */
const CATEGORY_ORDER = ['Páginas', 'Usuários', 'Tags', 'Projetos', 'Eventos', 'Permissões'];
const CATEGORY_ICON: Record<string, string> = {
  'Páginas': 'web',
  'Usuários': 'group',
  'Tags': 'sell',
  'Projetos': 'rocket_launch',
  'Eventos': 'event',
  'Permissões': 'admin_panel_settings',
};

export interface IPermissionGroup {
  category: string;
  icon: string;
  permissions: IPermissionModel[];
}

@Component({
  selector: 'app-view-list-permissions',
  standalone: true,
  templateUrl: './view-list-permissions.component.html',
  styleUrl: `./view-list-permissions.component.scss`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule, MatSlideToggleModule, MatTooltipModule],
})
export class ViewListPermissionsComponent {
  @Input() public accounts: IAccountModel[] = [];
  @Input() public selected: IAccountModel | null = null;
  @Input() public granted: ReadonlySet<number> = new Set();
  @Input() public lockedIds: ReadonlySet<number> = new Set();
  @Input() public myId: number | undefined;
  @Input() public canManage = false;
  @Input() public dirty = false;
  @Input() public loading = false;
  @Input() public saving = false;
  @Input() public connector!: ConnectorListPermissions;

  @Output() public readonly selectEvent = new EventEmitter<IAccountModel>();
  @Output() public readonly toggleEvent = new EventEmitter<number>();
  @Output() public readonly toggleGroupEvent = new EventEmitter<number[]>();
  @Output() public readonly discardEvent = new EventEmitter<void>();
  @Output() public readonly saveEvent = new EventEmitter<void>();

  public groups: IPermissionGroup[] = [];

  @Input() public set catalog(list: IPermissionModel[]) {
    const byCategory = new Map<string, IPermissionModel[]>();
    list.forEach((p) => byCategory.set(p.category, [...(byCategory.get(p.category) ?? []), p]));
    const rank = (c: string) => {
      const i = CATEGORY_ORDER.indexOf(c);
      return i === -1 ? CATEGORY_ORDER.length : i;
    };
    this.groups = [...byCategory.entries()]
      .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
      .map(([category, permissions]) => ({ category, icon: CATEGORY_ICON[category] ?? 'tune', permissions }));
  }

  public get grantedCount(): number {
    return this.granted.size;
  }

  public get totalCount(): number {
    return this.groups.reduce((n, g) => n + g.permissions.length, 0);
  }

  public groupOnCount(g: IPermissionGroup): number {
    return g.permissions.filter((p) => this.granted.has(p.id)).length;
  }

  public groupIds(g: IPermissionGroup): number[] {
    return g.permissions.map((p) => p.id);
  }

  public fullName(a: IAccountModel): string {
    const name = `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim();
    return name || a.login;
  }

  public initials(a: IAccountModel): string {
    const first = a.firstName?.trim()?.[0] ?? a.login?.[0] ?? '?';
    const last = a.lastName?.trim()?.[0] ?? '';
    return (first + last).toUpperCase();
  }

  public colorFor(id: number): string {
    return PALETTE[Math.abs(id) % PALETTE.length];
  }

  public clearSearch() {
    this.connector.textFieldControl.setValue('');
  }
}
