import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AbsClassInsertView, ControlsOf } from '@synergia-frontend/abstracts';
import { IDoListarEventos, IDoRegistrarEvento, IDoRegistrarProjeto } from '@synergia-frontend/interfaces';

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

      <div id="eventos-picker-container">
        <div class="label">Selecionar Eventos em qual participará:</div>
        <div id="eventos-for-container">
          @for (item of listaEventos; track $index) {
            <button 
              type="button" 
              class="evento-option" 
              [ngClass]="isEventoSelecionado(item) ? 'selected' : ''"
              (click)="toggleEvento(item)">
              {{ item.title }}
            </button>
          }
        </div>
      </div>
    </form>

    <div class="btn-line">
      <button mat-raised-button (click)="goToParentPage()">Voltar</button>
      <button mat-raised-button [disabled]="!isFormValid()" (click)="registrarEntidade()">Salvar</button>
    </div>
  `,
    styleUrl: 'style.scss',
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule
    ]
})
export class RegistrarProjetosViewComponent
extends AbsClassInsertView<IDoRegistrarProjeto> {
  @Input() listaEventos: IDoListarEventos[] = [];

  @Output() goToParentPageEvent = new EventEmitter<void>;
  @Output() registrarEntidadeEvent = new EventEmitter<IDoRegistrarProjeto>();

  public readonly form = this.fb.group<ControlsOf<IDoRegistrarProjeto>>({
    title: this.fb.control('', [
      Validators.required
    ]),
    description: this.fb.control('', [
      Validators.required
    ]),
    eventosSelecionados: this.fb.control<number[]>([])
  });

  override mapFormData(v: Partial<IDoRegistrarProjeto>): IDoRegistrarProjeto | null {
    if (v.title == null || v.description == null) {
      return null;
    }
    return {
      description: v.description,
      title: v.title,
      eventosSelecionados: this.eventosSelecionados().map(v => v.id)
    }
  } 

  public readonly eventosSelecionados = signal<IDoListarEventos[]>([]);

  public isEventoSelecionado(evento: IDoListarEventos) {
    return this.eventosSelecionados().findIndex((re) => re.id == evento.id) != -1;
  }
  public toggleEvento(evento: IDoListarEventos) {
    this.eventosSelecionados.update((res) => {
      const i = res.findIndex((re) => re.id == evento.id);
      if (i == -1) {
        return [...res, evento];
      } else {
        const lista = [...res];
        lista.splice(i, 1);
        return lista;
      }
    });
  }
}
