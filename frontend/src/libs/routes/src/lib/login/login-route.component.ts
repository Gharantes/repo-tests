import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonFormFieldComponent } from '@synergia-frontend/ui';
import { AuthenticationService } from '@synergia-frontend/services';

@Component({
  selector: 'lib-login',
  standalone: true,
  template: `
    <div id="route-container">
      <div id="container-for-system-options" class="abs-top-right">
        <div id="sistema-selecionado">Bloco</div>

        <div id="lista-sistemas">
          <div *ngFor="let option of systemOptions" class="sistema-option">
            Opção Bloco
          </div>
          <div *ngIf="systemOptions.length === 0" class="sistema-option">
            Nenhum bloco conhecido. Faça login em um bloco existente ou crie um
            novo.
          </div>
          <div class="login-em-novo-sistema">Fazer login em um outro Bloco</div>
          <div class="criar-novo-sistema">Criar novo Bloco</div>
        </div>
      </div>

      <div id="container-for-login-form">
        <form>
          <sy-common-form-field
            [label]="'Email'"
          ></sy-common-form-field>

          <sy-common-form-field
            [label]="'Senha'"
          ></sy-common-form-field>
        </form>
        
        <div>
          <button mat-raised-button (click)="login()">Login</button>
          <div>Esqueci minha senha</div>
        </div>
      </div>
    </div>
  `,
  imports: [
    CommonModule,
    MatFormField,
    MatInput,
    MatButton,
    MatLabel,
    CommonFormFieldComponent,
  ],
  styleUrl: 'login-route.component.scss',
})
export class LoginRouteComponent {
  constructor(
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService
  ) {}

  systemOptions: {
    title: string;
    imgUrl: string;
  }[] = [
    { title: 'Bloco 1', imgUrl: 'https://via.placeholder.com/150' },
    { title: 'Bloco 2', imgUrl: 'https://via.placeholder.com/150' },
    { title: 'Bloco 3', imgUrl: 'https://via.placeholder.com/150' },
  ];



  login() {
    this.authenticationService.updateAuthenticated(true);
    this.navigateToHome();
  }
  navigateToHome() {
    this.router.navigate(['/home']).then();
  }
}
