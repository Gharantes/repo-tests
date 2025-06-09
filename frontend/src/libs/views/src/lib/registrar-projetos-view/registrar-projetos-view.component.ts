import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, EventEmitter, Input, Output, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AbsClassInsertView, ControlsOf } from '@synergia-frontend/abstracts';
import { IDoListarEventos, IDoRegistrarProjeto } from '@synergia-frontend/interfaces';
import { Subject, take, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-registrar-projetos-view',
  template: `
    <form>
      <mat-form-field [appearance]="'outline'" class="field">
        <mat-label>Título</mat-label>
        <input type="text" matInput [formControl]="form.controls.title" />
      </mat-form-field>

      <mat-form-field [appearance]="'outline'" class="field">
        <mat-label>Descrição</mat-label>
        <input type="text" matInput [formControl]="form.controls.description" />
      </mat-form-field>

      <mat-form-field [appearance]="'outline'" class="field">
        <mat-label>URL do Banner</mat-label>
        <input type="text" matInput [formControl]="form.controls.urlBanner" />
      </mat-form-field>
    </form>

    <div class="btn-line">
      <button mat-raised-button (click)="goToParentPage()">Voltar</button>
      <button
        mat-raised-button
        [disabled]="!isFormValid()"
        (click)="registrarEntidade()"
      >
        Salvar
      </button>
    </div>
  `,
  styleUrl: 'style.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
})
export class RegistrarProjetosViewComponent
  extends AbsClassInsertView<IDoRegistrarProjeto>
  implements AfterViewInit
{
  @Input() listaEventos: IDoListarEventos[] = [];
  @Input() populateForm!: Subject<IDoRegistrarProjeto | null>;

  @Output() goToParentPageEvent = new EventEmitter<void>();
  @Output() registrarEntidadeEvent = new EventEmitter<IDoRegistrarProjeto>();

  constructor(
    private readonly destroyRef: DestroyRef
  ) {
    super();
  }

  public readonly form = this.fb.group<ControlsOf<IDoRegistrarProjeto>>({
    title: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required]),
    urlBanner: this.fb.control(null),
  });

  override mapFormData(
    v: Partial<IDoRegistrarProjeto>
  ): IDoRegistrarProjeto | null {
    if (v.title == null || v.description == null) {
      return null;
    }
    return {
      description: v.description,
      title: v.title,
      urlBanner: v.urlBanner ?? null
    };
  }
  ngAfterViewInit() {
    this.populateForm.pipe(
      tap(res => {
        if (res != null) {
          this.form.controls.title.setValue(res.title)
          this.form.controls.description.setValue(res.description)
        }
      }),
      take(1),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe()

  }
}