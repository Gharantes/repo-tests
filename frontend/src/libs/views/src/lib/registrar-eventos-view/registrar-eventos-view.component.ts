import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AbsClassInsertView, ControlsOf } from '@synergia-frontend/abstracts';
import { IDoNewEvent } from '@synergia-frontend/interfaces';

@Component({
  selector: 'lib-registrar-eventos-view',
  standalone: true,
  template: `
    <mat-form-field [appearance]="'outline'">
      <mat-label>Título</mat-label>
      <input type="text" matInput [formControl]="form.controls.title"/>
    </mat-form-field>

    <mat-form-field [appearance]="'outline'">
      <mat-label>Descrição</mat-label>
      <input type="text" matInput [formControl]="form.controls.description" />
    </mat-form-field>

    <div class="btn-line">
      <button mat-raised-button (click)="goToParentPage()">Voltar</button>
      <button mat-raised-button (click)="registrarEntidade()">Salvar</button>
    </div>
  `,
  styleUrl: 'style.scss',
  imports: [
    CommonModule, 
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule, 
    MatInputModule,
    ReactiveFormsModule
  ],
})
export class RegistrarEventosViewComponent 
extends AbsClassInsertView<IDoNewEvent> {
  @Output() goToParentPageEvent = new EventEmitter<void>;
  @Output() registrarEntidadeEvent = new EventEmitter<IDoNewEvent>();

  private readonly fb = inject(NonNullableFormBuilder);

  public readonly form = this.fb.group<ControlsOf<IDoNewEvent>>({
    title: this.fb.control('', [
      Validators.required
    ]),
    description: this.fb.control('', [
      Validators.required
    ])
  });

  override mapFormData(v: Partial<IDoNewEvent>): IDoNewEvent | null {
    if (v.title == null || v.description == null) {
      return null;
    }
    return {
      description: v.description,
      title: v.title
    }
  } 
  override registrarEntidade(): void  {
    const f = this.getFormData();
    if (f != null) {
        this.registrarEntidadeEvent.emit(f);
    }
  }
  override goToParentPage(): void {
    this.goToParentPageEvent.emit();
  }

}
