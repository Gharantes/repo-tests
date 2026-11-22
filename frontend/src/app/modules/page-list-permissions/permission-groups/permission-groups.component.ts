import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IPermissionModel } from '@synergia-frontend/interfaces';

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

interface IPermissionGroup {
  category: string;
  icon: string;
  permissions: IPermissionModel[];
}

/**
 * Lista de permissões agrupadas por categoria, com um toggle em cada.
 * Usada para editar as permissões avulsas de um usuário e as permissões de um perfil.
 */
@Component({
  selector: 'app-permission-groups',
  standalone: true,
  templateUrl: './permission-groups.component.html',
  styleUrl: './permission-groups.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatIconModule, MatSlideToggleModule, MatTooltipModule],
})
export class PermissionGroupsComponent {
  /** Ligadas e editáveis. */
  @Input() public granted: ReadonlySet<number> = new Set();
  /** Ligadas por outra origem (ex.: perfil); aparecem marcadas, sem toggle editável. id -> de onde vem. */
  @Input() public inherited: ReadonlyMap<number, string> = new Map();
  @Input() public disabled = false;
  @Output() public readonly toggleEvent = new EventEmitter<number>();
  @Output() public readonly toggleGroupEvent = new EventEmitter<number[]>();

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

  public isOn(id: number): boolean {
    return this.granted.has(id) || this.inherited.has(id);
  }

  public onCount(g: IPermissionGroup): number {
    return g.permissions.filter((p) => this.isOn(p.id)).length;
  }

  /** "Marcar todas" mexe só no que é editável aqui. */
  public editableIds(g: IPermissionGroup): number[] {
    return g.permissions.filter((p) => !this.inherited.has(p.id)).map((p) => p.id);
  }

  public allEditableOn(g: IPermissionGroup): boolean {
    return this.editableIds(g).every((id) => this.granted.has(id));
  }
}
