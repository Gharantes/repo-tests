import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AbsClassInsertView, ControlsOf } from '@synergia-frontend/abstracts';
import { IDoRegistrarEvento } from '@synergia-frontend/interfaces';
import { Subject, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-registrar-eventos-view',
  templateUrl: 'index.html',
  styleUrl: 'style.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class RegistrarEventosViewComponent
  extends AbsClassInsertView<IDoRegistrarEvento>
  implements AfterViewInit
{
  @Output() goToParentPageEvent = new EventEmitter<void>();
  @Output() registrarEntidadeEvent = new EventEmitter<IDoRegistrarEvento>();
  @Input() populateForm!: Subject<IDoRegistrarEvento | null>;

  constructor(private readonly destroyRef: DestroyRef) {
    super();
  }

  ngAfterViewInit() {
    this.populateForm
      .pipe(
        tap((res) => {
          if (res != null) {
            this.fillForm(res);
          }
        }),
        take(1),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  public readonly form = this.fb.group<ControlsOf<IDoRegistrarEvento>>({
    title: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required]),
    urlBanner: this.fb.control(null, []),
    tags: this.fb.control([])
  });

  override mapFormData(
    v: Partial<IDoRegistrarEvento>
  ): IDoRegistrarEvento | null {
    if (v.title == null || v.description == null) {
      return null;
    }
    if (v.title == '' || v.description == '') {
      return null;
    }
    return {
      description: v.description,
      title: v.title,
      urlBanner: v.urlBanner ?? null,
      tags: v.tags ?? []
    };
  }

  private fillForm(res: IDoRegistrarEvento) {
    this.form.controls.title.setValue(res.title);
    this.form.controls.description.setValue(res.description);
    this.form.controls.urlBanner.setValue(res.urlBanner);
  }
}
