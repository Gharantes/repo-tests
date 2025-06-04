import { Component, inject, OnInit, signal } from '@angular/core';
import { AbsBaseRoute } from '@synergia-frontend/abstracts';
import { PageListarEventosResourceService } from '@synergia-frontend/api';
import { IDoCardGrid, IDoListarEventos } from '@synergia-frontend/interfaces';
import {
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import { ListarEventosViewComponent } from '@synergia-frontend/views';
import { catchError, concatMap, EMPTY, map, tap } from 'rxjs';
import {
  mapFromListarEventosDtoToIDoListarEventos,
  mapFromListarEventosDtoToIDoListarEventosArray
} from '@synergia-frontend/mappers';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SafeImageComponent } from '@synergia-frontend/components';
import { getRandomColor } from '@synergia-frontend/utils';

@Component({
  selector: 'app-evento-card-dialog',
  standalone: true,
  template: `
    <div class="column-section" style="width: 300px">
      <lib-safe-image
        [url]="evento$()?.bannerUrl"
        [altColor]="backgroundColor"
      ></lib-safe-image>

      <div class="section">
        <div class="title">
          {{ evento$()?.title }}
        </div>
        <div class="owner">
          {{ evento$()?.createdByNameAccount }}
        </div>
      </div>

      <div class="line"></div>

      <div class="section">
        <div class="other-members">
          <b>Outros Membros:</b>
        </div>
        
        <div class="description">
          <b>Descrição:</b>
          {{ evento$()?.description }}
        </div>
      </div>
    </div>
    
    <div class="column-section actions-section" style="width: 200px">
      <button>Enviar Pedido</button>
      <button (click)="editar()">Editar Evento</button>
    </div>
  `,
  styleUrl: 'style.scss',
  imports: [SafeImageComponent],
})
export class EventoCardDialogComponent {
  private readonly injectData: IDoCardGrid = inject(MAT_DIALOG_DATA);
  public readonly backgroundColor = getRandomColor()

  public readonly evento$ = signal<IDoListarEventos | null>(null);
  constructor(
    private readonly dialog: MatDialogRef<EventoCardDialogComponent>,
    private readonly pageService: PageListarEventosResourceService,
    private readonly routingService: RoutingService,
  ) {
    this.pageService
      .listarEventosById(this.injectData.id)
      .pipe(
        map((res) => mapFromListarEventosDtoToIDoListarEventos(res)),
        tap((res) => this.evento$.set(res))
      )
      .subscribe();
  }

  close() {
    this.dialog.close(null);
  }

  protected readonly getRandomColor = getRandomColor;

  public editar() {
    this.routingService.goTo(
      this.routingService.editEvents(this.injectData.id),
    );
    this.dialog.close(null);
  }
}