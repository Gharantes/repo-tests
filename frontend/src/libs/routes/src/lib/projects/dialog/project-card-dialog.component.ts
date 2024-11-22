import { Component, DestroyRef, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { ProjectDto, ProjectResourceService } from '@synergia-frontend/api';
import { catchError, EMPTY, tap } from 'rxjs';
import { SnackbarService, TenantsService } from '@synergia-frontend/services';
import { DialogRef } from '@angular/cdk/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'lib-project-card-dialog',
  standalone: true,
  template: `
    <div id="project-card-dialog-container">
      <h2>
        {{ data.title }}
      </h2>

      {{ data.id }}
      {{ data.title }}
      {{ data.description }}

      <button mat-stroked-button color="warn" (click)="deleteProject()">
        Deletar Projeto
      </button>

      <button mat-stroked-button color="warn'" [mat-dialog-close]="null">
        Fechar
      </button>

      <button mat-stroked-button [disabled]="true">
        Adicionar Membros à Equipe
      </button>
    </div>
  `,
  styles: [
    `
      :host {
        padding: 10px;
      }
      #project-card-dialog-container {
        width: 100%;
        height: 100%;

        h2 {
          width: 100%;
          text-align: justify;
        }
      }
    `,
  ],
  imports: [MatButton, MatDialogClose],
  providers: [],
})
export class ProjectCardDialogComponent {
  public readonly data = inject<ProjectDto>(MAT_DIALOG_DATA);

  constructor(
    private readonly tenantsService: TenantsService,
    private readonly snackbarService: SnackbarService,
    private readonly projectRService: ProjectResourceService,
    private readonly destroyRef: DestroyRef,
    private readonly dialogRef: DialogRef<boolean>
  ) {}

  deleteProject() {
    const idTenant = this.tenantsService.getTenantId() ?? -1;
    const id = this.data.id;

    this.projectRService
      .deleteProject(idTenant, id)
      .pipe(
        catchError((err) => {
          this.snackbarService.handleCatchError(err, 'Erro ao deletar projeto');
          return EMPTY;
        }),
        tap(() => {
          this.snackbarService.temporaryMessage('Projeto deletado com sucesso');
          this.closeDialog(true);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private closeDialog(reload = false) {
    this.dialogRef.close(reload);
  }
}