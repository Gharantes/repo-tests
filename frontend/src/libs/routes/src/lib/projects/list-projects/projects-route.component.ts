import { Component, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFormFieldComponent } from '@synergia-frontend/ui';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { ProjectsFacadeService } from './projects-facade.service';
import { ProjectDto } from '@synergia-frontend/api';
import { MatDialog } from '@angular/material/dialog';
import { ProjectCardDialogComponent } from '../dialog/project-card-dialog.component';
import { NavigationService } from '@synergia-frontend/services';

@Component({
  selector: 'lib-projects',
  standalone: true,
  imports: [
    CommonModule,
    CommonFormFieldComponent,
    FormsModule,
    MatButton,
    MatCard,
    ReactiveFormsModule,
  ],
  template: `
    <div id="projects-route-top-contaienr">
      <lib-sy-common-form-field
        id="search-field"
        [prefix]="true"
        [icon]="'search'"
        [label]="'Procure por Projetos...'"
        [control]="searchControl"
      ></lib-sy-common-form-field>

      <button
        id="create-new-project-btn"
        mat-stroked-button
        (click)="navigateToCreateProjectsPage()"
      >
        Criar Novo Projeto
      </button>
    </div>

    <div id="project-cards-container">
      <mat-card
        *ngFor="let project of facade.projects()"
        (click)="openProjectCard(project)"
        [appearance]="'outlined'"
        class="project-card"
      >
        <div class="project-picture-container">
          <img class="project-picture" [src]="placeholderImgUrl" alt="" />
        </div>
        <div class="project-details-container">
          <div class="project-title">{{ project.title }}</div>
        </div>
      </mat-card>
    </div>
  `,
  styleUrl: 'projects-route.component.scss',
  providers: [ProjectsFacadeService],
})
export class ProjectsRouteComponent {
  public readonly placeholderImgUrl =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/681px-Placeholder_view_vector.svg.png';

  public readonly searchControl: FormControl<string | null>;

  constructor(
    public readonly facade: ProjectsFacadeService,
    private readonly fb: FormBuilder,
    private readonly dialog: MatDialog,
    private readonly destroyRef: DestroyRef,
    private readonly navigationService: NavigationService
  ) {
    this.searchControl = this.fb.control(null);

    this.facade.initializeNgUpdate(this.destroyRef);
    this.facade.update();
  }

  openProjectCard(project: ProjectDto) {
    this.dialog.open(ProjectCardDialogComponent, {
      data: project,
    });
  }

  navigateToCreateProjectsPage() {
    this.navigationService.navigateProjects().create().then();
  }
}
