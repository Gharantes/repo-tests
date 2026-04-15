import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { NgForOf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IProjectModel, ITagModel } from '@synergia-frontend/interfaces';
import { EntityTagResourceService } from '@synergia-frontend/api';
import { SessionService } from '@synergia-frontend/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { TagDtoToModel } from '@synergia-frontend/mappers';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'lib-dialog-add-tag',
  standalone: true,
  templateUrl: './dialog-add-tag.component.html',
  styleUrl: './dialog-add-tag.component.scss',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormField,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatInput,
    MatLabel,
    MatOption,
    NgForOf,
    ReactiveFormsModule,
  ],
})
export class DialogAddTagComponent {
  public readonly tags$ = signal<ITagModel[]>([]);

  private readonly fb = inject(FormBuilder);
  public readonly tagControl = this.fb.control<null | string | ITagModel>(null);
  public readonly tagService = inject(EntityTagResourceService);
  public readonly sessionService = inject(SessionService);
  public readonly destroyRef = inject(DestroyRef);
  public readonly dialogRef = inject(MatDialogRef<DialogAddTagComponent>);
  public readonly data$: {
    forProjects?: boolean,
    forEvents?: boolean,
    forAccounts?: boolean,
  } = inject(MAT_DIALOG_DATA);

  constructor() {
    this.searchTags();

    this.tagControl.valueChanges
      .pipe(
        tap(() => this.searchTags()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private searchTags() {
    const textValue = this.displayTag(this.tagControl.value);

    this.tagService.listTagsByTenant(
      this.sessionService.getTenantId() as number,
      this.data$.forProjects ?? false,
      this.data$.forEvents ?? false,
      this.data$.forAccounts ?? false,
      textValue
    ).pipe(
      map(res => res.map(v => TagDtoToModel(v))),
      tap(res => this.tags$.set(res))
    ).subscribe();
  }

  protected displayTag: (value: null | string | ITagModel) => string = (v) => {
    if (v == null) {
      return '';
    } else if (typeof v === 'string') {
      return v;
    } else {
      return v.title;
    }
  };

  protected salvarTag() {
    const v = this.tagControl.value;
    if (v == null || typeof v === 'string') {
      this.dialogRef.close(null)
    } else {
      this.dialogRef.close(v);
    }
  }
}
