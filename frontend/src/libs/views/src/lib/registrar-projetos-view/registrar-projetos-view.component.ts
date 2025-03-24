import { RoutingService } from '@synergia-frontend/services';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

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
      <button mat-raised-button (click)="voltar()">Voltar</button>
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
export class RegistrarProjetosViewComponent {
  
  private readonly routingService = inject(RoutingService)

  @Output() goToLastPageEvent = new EventEmitter<void>;

  voltar() {
    return this.routingService.goTo(this.routingService.projects()); 
  }

}
