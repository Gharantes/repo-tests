import { RoutingService } from '@synergia-frontend/services';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'lib-registrar-usuarios-view',
  standalone: true,
  template: `

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
export class RegistrarUsuariosViewComponent {
  
  private readonly routingService = inject(RoutingService)

  @Output() goToLastPageEvent = new EventEmitter<void>;

  voltar() {
    return this.routingService.goTo(this.routingService.users()); 
  }

}
