import { RoutingService } from '@synergia-frontend/services';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AbsClassInsertView, ControlsOf } from '@synergia-frontend/abstracts';
import { IDoRegistrarUsuario } from '@synergia-frontend/interfaces';
import { ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'lib-registrar-usuarios-view',
    template: `
    <div id="form-container">
      <mat-form-field [appearance]="'outline'">
        <mat-label>Nome</mat-label>
        <input type="text" matInput [formControl]="form.controls.firstName"/>
      </mat-form-field>

      <mat-form-field [appearance]="'outline'">
        <mat-label>Sobrenome</mat-label>
        <input type="text" matInput [formControl]="form.controls.lastName"/>
      </mat-form-field>

      <mat-form-field [appearance]="'outline'">
        <mat-label>Username</mat-label>
        <input type="text" matInput [formControl]="form.controls.login"/>
      </mat-form-field>

      <mat-form-field [appearance]="'outline'">
        <mat-label>Senha</mat-label>
        <input type="text" matInput [formControl]="form.controls.password" />
      </mat-form-field>
    </div>
    <div class="btn-line">
      <button mat-raised-button (click)="voltar()">Voltar</button>
      <button 
        [disabled]="!isFormValid()"
        mat-raised-button 
        (click)="registrarEntidade()">
        Salvar
      </button>
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
export class RegistrarUsuariosViewComponent 
extends AbsClassInsertView<IDoRegistrarUsuario> {
  @Output() registrarEntidadeEvent = new EventEmitter<IDoRegistrarUsuario>();
  @Output() goToParentPageEvent = new EventEmitter<void>;

  public form = this.fb.group<ControlsOf<IDoRegistrarUsuario>>({
    login: this.fb.control<string>('', [Validators.required]),
    password: this.fb.control<string>('', [Validators.required]),
    firstName: this.fb.control<string>('', [Validators.required]),
    lastName: this.fb.control<string>('', [Validators.required]),
  })

  private readonly routingService = inject(RoutingService)

  override mapFormData(v: Partial<IDoRegistrarUsuario>): IDoRegistrarUsuario | null {
    if (v.login && v.password && v.firstName && v.lastName) {
      return {
        firstName: v.firstName,
        lastName: v.lastName,
        login: v.login,
        password: v.password
      }
    }  
    return null;
  }
  voltar() {
    return this.routingService.goTo(this.routingService.users()); 
  }

}
