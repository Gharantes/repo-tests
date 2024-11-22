import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonFormFieldComponent } from '@synergia-frontend/ui';
import { MatButton } from '@angular/material/button';
import {
  NavigationService,
  SnackbarService,
  TenantsService,
} from '@synergia-frontend/services';
import { ProjectResourceService } from '@synergia-frontend/api';
import { catchError, EMPTY, take, tap } from 'rxjs';

@Component({
  selector: 'lib-create-projects-route',
  standalone: true,
  template: `
    <form [formGroup]="form">
      <lib-sy-common-form-field
        [label]="'Nome'"
        [control]="form.controls.name"
      ></lib-sy-common-form-field>

      <lib-sy-common-form-field
        [label]="'Descrição'"
        [control]="form.controls.description"
      ></lib-sy-common-form-field>
    </form>

    <button mat-raised-button (click)="navigateToProjectsPage()" color="warn">
      Voltar
    </button>

    <button
      mat-raised-button
      [disabled]="invalidForm"
      (click)="createProject()"
    >
      Criar Projeto
    </button>
  `,
  styles: [``],
  imports: [ReactiveFormsModule, CommonFormFieldComponent, MatButton],
  providers: [],
})
export class CreateProjectsRouteComponent {
  public readonly form;

  constructor(
    private readonly tenantsService: TenantsService,
    private readonly snackbarService: SnackbarService,
    private readonly navigationService: NavigationService,
    private readonly projectRService: ProjectResourceService,
    private readonly fb: FormBuilder
  ) {
    this.form = this.createForm();
  }
  public createForm() {
    return this.fb.group({
      name: this.fb.control<string>('', Validators.required),
      description: this.fb.control<string>('', Validators.required),
    });
  }
  public get invalidForm() {
    return this.form.invalid;
  }
  createProject() {
    const idTenant = this.tenantsService.getTenantId() ?? -1;
    const form = this.form.value;

    this.projectRService
      .createProject({
        title: form.name ?? '',
        description: form.description ?? '',
        idTenant: idTenant,
      })
      .pipe(
        catchError((err) => {
          this.snackbarService.handleCatchError(err, 'Erro ao criar projecto');
          return EMPTY;
        }),
        tap(() => {
          this.snackbarService.temporaryMessage('Projecto criado com sucesso');
          this.navigateToProjectsPage();
          this.form.reset();
        }),
        take(1)
      )
      .subscribe();
  }

  navigateToProjectsPage() {
    this.navigationService.navigateProjects().listAll().then();
  }
}