import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AbsClassInsertView, ControlsOf } from '@synergia-frontend/abstracts';
import { IDoRegistrarEvento, IDoRegistrarProjeto } from '@synergia-frontend/interfaces';

@Component({
  selector: 'lib-registrar-projetos-view',
  standalone: true,
  template: `
    <mat-form-field [appearance]="'outline'">
      <mat-label>Título</mat-label>
      <input type="text" matInput />
    </mat-form-field>

    <mat-form-field [appearance]="'outline'">
      <mat-label>Descrição</mat-label>
      <input type="text" matInput />
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
    MatButtonModule
  ],
})
export class RegistrarProjetosViewComponent
extends AbsClassInsertView<IDoRegistrarEvento> {
  
  @Output() goToParentPageEvent = new EventEmitter<void>;
  @Output() registrarEntidadeEvent = new EventEmitter<IDoRegistrarEvento>();

  private readonly fb = inject(NonNullableFormBuilder);

  public readonly form = this.fb.group<ControlsOf<IDoRegistrarProjeto>>({
    title: this.fb.control('', [
      Validators.required
    ]),
    description: this.fb.control('', [
      Validators.required
      ])
  });

  override mapFormData(v: Partial<IDoRegistrarEvento>): IDoRegistrarEvento | null {
    if (v.title == null || v.description == null) {
      return null;
    }
    return {
      description: v.description,
      title: v.title
    }
  } 
}
