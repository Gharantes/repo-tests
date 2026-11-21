import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ITagModel } from '@synergia-frontend/interfaces';
import { ConnectorListTags } from '../connector/connector-list-tags';

type TagScopeKey = 'forProjects' | 'forEvents' | 'forAccounts';

interface ITagScope {
  key: TagScopeKey;
  label: string;
  icon: string;
}

/** Cores derivadas do ID, para cada tag ter uma identidade visual estável. */
const TAG_PALETTE = ['#3B52CC', '#FF7043', '#16A34A', '#9333EA', '#0891B2', '#DB2777', '#CA8A04', '#4F46E5'];

@Component({
  selector: 'app-view-list-tags',
  standalone: true,
  templateUrl: './view-list-tags.component.html',
  styleUrl: `./view-list-tags.component.scss`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, MatButtonModule, MatIconModule, MatMenuModule],
})
export class ViewListTagsComponent {
  @Input() public data$!: ITagModel[];
  @Input() public connector!: ConnectorListTags;

  @Output() public readonly createTagEvent = new EventEmitter<void>();
  @Output() public readonly deleteTagEvent = new EventEmitter<ITagModel>();
  @Output() public readonly editTagEvent = new EventEmitter<ITagModel>();

  public readonly scopes: ITagScope[] = [
    { key: 'forProjects', label: 'Projetos', icon: 'folder' },
    { key: 'forEvents', label: 'Eventos', icon: 'event' },
    { key: 'forAccounts', label: 'Usuários', icon: 'person' },
  ];

  /** Filtro local por disponibilidade (sobre as tags já carregadas). */
  public scopeFilter: TagScopeKey | null = null;

  public get filtered(): ITagModel[] {
    const f = this.scopeFilter;
    return f ? this.data$.filter((t) => t[f]) : this.data$;
  }

  public countFor(key: TagScopeKey): number {
    return this.data$.filter((t) => t[key]).length;
  }

  public toggleFilter(key: TagScopeKey) {
    this.scopeFilter = this.scopeFilter === key ? null : key;
  }

  public colorFor(tag: ITagModel): string {
    return TAG_PALETTE[Math.abs(tag.id) % TAG_PALETTE.length];
  }

  public initialOf(tag: ITagModel): string {
    return (tag.title?.trim()?.[0] ?? '#').toUpperCase();
  }

  public clearSearch() {
    this.connector.textFieldControl.setValue('');
  }
}
