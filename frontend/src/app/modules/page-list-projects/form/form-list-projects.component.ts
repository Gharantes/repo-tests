import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatLabel } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { ConnectorListProjects } from '../connector/connector-list-projects';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { ITagModel } from '@synergia-frontend/interfaces';
import { EntityTagResourceService } from '@synergia-frontend/api';
import { SessionService } from '@synergia-frontend/services';
import { TagDtoToModel } from '@synergia-frontend/mappers';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, map, tap } from 'rxjs';

@Component({
  selector: 'app-form-list-projects',
  templateUrl: './form-list-projects.component.html',
  styleUrl: './form-list-projects.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormField,
    MatPrefix,
    MatInput,
    FormsModule,
    MatLabel,
    ReactiveFormsModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
  ],
})
export class FormListProjectsComponent implements OnInit {
  @Input() connector!: ConnectorListProjects;

  private readonly tagService = inject(EntityTagResourceService);
  private readonly sessionService = inject(SessionService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly tagSearchControl = new FormControl('', { nonNullable: true });
  public readonly filteredTags$ = signal<ITagModel[]>([]);

  ngOnInit(): void {
    this.searchTags();
    this.tagSearchControl.valueChanges
      .pipe(
        debounceTime(300),
        tap(() => this.searchTags()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private searchTags() {
    const idTenant = this.sessionService.getTenantId();
    if (idTenant == null) return;

    this.tagService
      .listTagsByTenant(idTenant, true, false, false, this.tagSearchControl.value)
      .pipe(map((res) => res.map((v) => TagDtoToModel(v))))
      .subscribe((res) => this.filteredTags$.set(res));
  }

  protected isSelected(tag: ITagModel): boolean {
    return this.connector.form.controls.tags.value.some((v) => v.id === tag.id);
  }

  protected tagsPlaceholder(): string {
    const tags = this.connector.form.controls.tags.value;
    if (tags.length === 0) return 'Buscar tags...';
    if (tags.length === 1) return tags[0].title;
    return `${tags.length} tags selecionadas`;
  }

  protected selectTag(event: MatAutocompleteSelectedEvent, trigger: MatAutocompleteTrigger) {
    const tag = event.option.value as ITagModel;
    const control = this.connector.form.controls.tags;
    const alreadySelected = control.value.some((v) => v.id === tag.id);

    control.setValue(
      alreadySelected
        ? control.value.filter((v) => v.id !== tag.id)
        : [...control.value, tag]
    );

    this.tagSearchControl.setValue('');
    this.searchTags();

    setTimeout(() => trigger.openPanel());
  }
}
