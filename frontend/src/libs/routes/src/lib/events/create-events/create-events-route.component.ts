import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonFormFieldComponent } from '@synergia-frontend/ui';
import { MatButton } from '@angular/material/button';
import { NavigationService, SnackbarService, TenantsService } from '@synergia-frontend/services';
import { EventResourceService } from '@synergia-frontend/api';
import { catchError, EMPTY, take, tap } from 'rxjs';

@Component({
  selector: 'lib-create-events-route',
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


    <button mat-raised-button (click)="navigateToEventsPage()" color="warn">
      Voltar
    </button>
    
    <button mat-raised-button [disabled]="invalidForm" (click)="createEvent()">
      Criar
    </button>
  `,
  styles: [``],
  imports: [ReactiveFormsModule, CommonFormFieldComponent, MatButton],
  providers: [],
})
export class CreateEventsRouteComponent {
  public readonly form;

  constructor(
    private readonly tenantsService: TenantsService,
    private readonly snackbarService: SnackbarService,
    private readonly navigationService: NavigationService,
    private readonly eventRService: EventResourceService,
    private readonly fb: FormBuilder,
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
  createEvent() {
    const idTenant = this.tenantsService.getTenantId() ?? -1;
    const form = this.form.value;

    this.eventRService.createEvent({
      title: form.name ?? '',
      description: form.description ?? '',
      idTenant: idTenant,
    }).pipe(
      catchError(err => {
        this.snackbarService.handleCatchError(err, 'Erro ao criar evento');
        return EMPTY;
      }),
      tap(() => {
        this.snackbarService.temporaryMessage('Evento criado com sucesso');
        this.navigateToEventsPage()
        this.form.reset();
      }),
      take(1),
    ).subscribe();
  }

  navigateToEventsPage() {
    this.navigationService.navigateEvents().listAll().then();
  }
}