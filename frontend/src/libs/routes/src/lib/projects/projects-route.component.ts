import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFormFieldComponent } from '@synergia-frontend/ui';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { Subject } from 'rxjs';
import { EventsFacadeService } from '../events/events-facade.service';
import { Projects } from '@angular/cli/lib/config/workspace-schema';
import { ProjectsFacadeService } from './projects-facade.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'lib-projects',
  standalone: true,
  imports: [
    CommonModule,
    CommonFormFieldComponent,
    FormsModule,
    MatButton,
    MatCard,
    MatDivider,
    ReactiveFormsModule,
    MatIconButton,
    MatIcon,
  ],
  template: `
    <form [formGroup]="form">
      <lib-sy-common-form-field
        [label]="'Nome'"
        [control]="form.controls.name"
      ></lib-sy-common-form-field>
    </form>

    <button
      mat-raised-button
      [disabled]="invalidForm"
      (click)="createProject()"
    >
      Criar
    </button>

    <mat-divider class="divider"></mat-divider>

    <div id="event-cards-container">
      <mat-card
        *ngFor="let event of facade.projects()"
        class="event-card"
        [appearance]="'outlined'"
      >
        <div id="delete-btn">
          <button mat-icon-button (click)="deleteProject(event.id)">
            <mat-icon>delete</mat-icon>
          </button>
        </div>
        <div class="event-picture-container">
          <img class="event-picture" [src]="placeholderImgUrl" alt="" />
        </div>
        <div class="event-details-container">
          <div class="event-title">{{ event.title }}</div>
        </div>
      </mat-card>
    </div>
  `,
  styleUrl: 'projects-route.component.scss',
  providers: [ProjectsFacadeService],
})
export class ProjectsRouteComponent implements OnDestroy {
  public readonly placeholderImgUrl =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png';

  ngUnsubscribe = new Subject<void>();
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public readonly form;

  constructor(
    public readonly facade: ProjectsFacadeService,
    private readonly fb: FormBuilder
  ) {
    this.form = this.createForm();

    this.facade.initializeNgUpdate(this.ngUnsubscribe);
    this.facade.update();
  }

  public createForm() {
    return this.fb.group({
      name: this.fb.control<string>('', Validators.required),
      description: this.fb.control<string>(''),
    });
  }
  get invalidForm() {
    return this.form.invalid;
  }

  createProject() {
    const form = this.form.value;
    const formValue = {
      name: form.name,
      description: form.description,
    };
    this.facade.createProject(formValue);
  }

  deleteProject(idProjeto: number) {
    this.facade.deleteProject(idProjeto)
  }
}
