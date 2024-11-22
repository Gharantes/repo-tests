import { Component, DestroyRef, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventDto, EventResourceService } from '@synergia-frontend/api';
import { catchError, EMPTY, tap } from 'rxjs';
import { SnackbarService, TenantsService } from '@synergia-frontend/services';
import { DialogRef } from '@angular/cdk/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'lib-event-card-dialog',
  standalone: true,
  template: `
    <div id="event-card-dialog-container">
      <h2>
        {{ data.title }}
      </h2>

      {{ data.id }}
      {{ data.title }}
      {{ data.description }}

      <button mat-stroked-button color="warn" (click)="deleteEvent()"></button>
    </div>
  `,
  styles: [
    `
      :host {
        padding: 10px;
      }
      #event-card-dialog-container {
        width: 100%;
        height: 100%;

        h2 {
          width: 100%;
          text-align: justify;
        }
      }
    `,
  ],
  imports: [MatButton],
  providers: [],
})
export class EventCardDialogComponent {
  public readonly data = inject<EventDto>(MAT_DIALOG_DATA);

  constructor(
    private readonly tenantsService: TenantsService,
    private readonly snackbarService: SnackbarService,
    private readonly eventRService: EventResourceService,
    private readonly destroyRef: DestroyRef,
    private readonly dialogRef: DialogRef<boolean>
  ) {}

  deleteEvent() {
    const idTenant = this.tenantsService.getTenantId() ?? -1;
    const id = this.data.id;

    this.eventRService
      .deleteEvent(idTenant, id)
      .pipe(
        catchError((err) => {
          this.snackbarService.handleCatchError(err, 'Erro ao deletar evento');
          return EMPTY;
        }),
        tap(() => {
          this.snackbarService.temporaryMessage('Evento deletado com sucesso');
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