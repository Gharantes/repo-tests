import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AbsClassInsertView, ControlsOf } from '@synergia-frontend/abstracts';
import { IDoRegistrarEvento } from '@synergia-frontend/interfaces';

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
    ReactiveFormsModule
  ]
})
export class RegistrarEventosViewComponent 
extends AbsClassInsertView<IDoRegistrarEvento> {
  @Output() goToParentPageEvent = new EventEmitter<void>;
  @Output() registrarEntidadeEvent = new EventEmitter<IDoRegistrarEvento>();

  public readonly form = this.fb.group<ControlsOf<IDoRegistrarEvento>>({
    title: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required]),
    urlBanner: this.fb.control(null, [])
  });

  override mapFormData(v: Partial<IDoRegistrarEvento>): IDoRegistrarEvento | null {
    if (v.title == null || v.description == null) {
      return null;
    }
    if (v.title == '' || v.description == '') {
      return null;
    }
    return {
      description: v.description,
      title: v.title,
      urlBanner: v.urlBanner ?? null
    }
  } 
}
