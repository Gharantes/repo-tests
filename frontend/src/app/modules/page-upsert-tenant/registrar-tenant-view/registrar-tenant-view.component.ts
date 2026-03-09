import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AbsClassInsertView, ControlsOf } from '@synergia-frontend/abstracts';
import { IRegistrarTenant } from '@synergia-frontend/interfaces';

@Component({
  selector: 'lib-registrar-tenant-view',
  standalone: true,
  template: `
    <div id="form">
      <mat-form-field [appearance]="'outline'">
        <mat-label>Título</mat-label>
        <input type="text" matInput [formControl]="form.controls.title"/>
      </mat-form-field>
  
      <mat-form-field [appearance]="'outline'">
        <mat-label>Identifier</mat-label>
        <input type="text" matInput [formControl]="form.controls.identifier" />
      </mat-form-field>

      <div class="btn-line">
        <button mat-raised-button (click)="voltar()">Voltar</button>
        <button mat-raised-button [disabled]="!isFormValid()" (click)="registrarEntidade()">Registrar</button>
      </div>
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
export class RegistrarTenantViewComponent
extends AbsClassInsertView<IRegistrarTenant> {
  @Output() goToParentPageEvent = new EventEmitter<void>();
  @Output() registrarEntidadeEvent = new EventEmitter<IRegistrarTenant>();

  public readonly form = this.fb.group<ControlsOf<IRegistrarTenant>>({
    title: this.fb.control('', [Validators.required]),
    identifier: this.fb.control('', [Validators.required])
  });
  voltar() {
    this.goToParentPageEvent.emit(); 
  }

  override mapFormData(v: Partial<IRegistrarTenant>): IRegistrarTenant | null {
    if (v.title == null || v.identifier == null) {
      return null;
    }
    if (v.title == '' || v.identifier == '') {
      return null;
    }
    return {
      identifier: v.identifier,
      title: v.title
    }
  } 
}
