import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, map } from 'rxjs';
import { IAccountModel, IEventModel, ITagModel } from '@synergia-frontend/interfaces';
import { EntityTagResourceService } from '@synergia-frontend/api';
import { AuthPermission, PermissionService, SessionService } from '@synergia-frontend/services';
import { TagDtoToModel } from '@synergia-frontend/mappers';
import { SafeImageComponent } from '@synergia-frontend/components';
import { ConnectorListEvents } from '../connector/connector-list-events';

/** Cores derivadas do ID, para cada evento/tag ter uma identidade visual estável. */
const PALETTE = ['#3B52CC', '#FF7043', '#16A34A', '#9333EA', '#0891B2', '#DB2777', '#CA8A04', '#4F46E5'];

@Component({
  selector: 'app-view-list-events',
  standalone: true,
  templateUrl: './view-list-events.component.html',
  styleUrl: './view-list-events.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, MatAutocompleteModule, MatButtonModule, MatIconModule, SafeImageComponent],
})
export class ViewListEventsComponent implements OnInit {
  @Input() data$!: IEventModel[];
  public readonly permissions = inject(PermissionService);
  public readonly P = AuthPermission;
  @Input() connector!: ConnectorListEvents;

  @Output() lookupEvent = new EventEmitter<void>();
  @Output() insertEvent = new EventEmitter<void>();
  @Output() openCardEvent = new EventEmitter<IEventModel>();

  private readonly tagService = inject(EntityTagResourceService);
  private readonly sessionService = inject(SessionService);
  private readonly destroyRef = inject(DestroyRef);

  /** Texto digitado para achar tags no filtro (não filtra eventos por si só). */
  public readonly tagSearchControl = new FormControl('', { nonNullable: true });
  /** Tags de evento do tenant que batem com `tagSearchControl`. */
  public readonly availableTags$ = signal<ITagModel[]>([]);

  ngOnInit(): void {
    this.searchTags();
    this.tagSearchControl.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.searchTags());
  }

  private searchTags() {
    const idTenant = this.sessionService.getTenantId();
    if (idTenant == null) return;
    this.tagService
      .listTagsByTenant(idTenant, false, true, false, this.tagSearchControl.value)
      .pipe(map((res) => res.map((v) => TagDtoToModel(v))))
      .subscribe((res) => this.availableTags$.set(res));
  }

  public get activeTags(): ITagModel[] {
    return this.connector.form.controls.tags.value;
  }

  public get hasFilters(): boolean {
    return !!this.connector.form.controls.text.value || this.activeTags.length > 0;
  }

  public isSelected(tag: ITagModel): boolean {
    return this.activeTags.some((v) => v.id === tag.id);
  }

  public toggleTag(tag: ITagModel) {
    const control = this.connector.form.controls.tags;
    control.setValue(this.isSelected(tag) ? control.value.filter((v) => v.id !== tag.id) : [...control.value, tag]);
  }

  public clearSearch() {
    this.connector.form.controls.text.setValue('');
  }

  public clearFilters() {
    this.connector.form.setValue({ text: '', tags: [] });
  }

  public colorFor(id: number): string {
    return PALETTE[Math.abs(id) % PALETTE.length];
  }

  /** Cor de fundo do banner quando não há imagem (cai na paleta se vier vazia). */
  public bannerBg(p: IEventModel): string {
    return p.bannerColor || this.colorFor(p.id);
  }

  public initialOf(p: IEventModel): string {
    return (p.title?.trim()?.[0] ?? '#').toUpperCase();
  }

  public memberInitials(a: IAccountModel): string {
    return ((a.firstName?.[0] ?? a.login?.[0] ?? '') + (a.lastName?.[0] ?? '')).toUpperCase();
  }
}
