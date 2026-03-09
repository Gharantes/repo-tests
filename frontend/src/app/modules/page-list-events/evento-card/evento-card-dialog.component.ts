import { Component, inject, signal } from '@angular/core';
import { PageListarEventosResourceService } from '@synergia-frontend/api';
import { IDoCardGrid, IDoListarEventos } from '@synergia-frontend/interfaces';
import { RoutingService, SessionService } from '@synergia-frontend/services';
import { map, tap } from 'rxjs';
import { mapFromListarEventosDtoToIDoListarEventos } from '@synergia-frontend/mappers';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SafeImageComponent } from '@synergia-frontend/components';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-evento-card-dialog',
  standalone: true,
  template: `
    <div class="column-section" style="width: 300px">
      <lib-safe-image
        [url]="evento$()?.bannerUrl"
        [altColor]="injectData.backgroundColor"
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
      <div 
        class="button-container" 
        [matTooltip]="evento$()?.userIsMember === true ? 'Você já faz parte do evento' : ''">
        <button 
          [disabled]="evento$()?.userIsMember === true">
          Enviar Pedido
        </button>
      </div>
      
      <div 
        class="button-container" 
        [matTooltip]="evento$()?.userIsMember === true ? '' : 'Você não faz parte do evento'">
        <button 
          [disabled]="evento$()?.userIsMember === false"
          (click)="editar()">
          Editar Evento
        </button>
      </div>
    </div>
  `,
  styleUrl: 'style.scss',
  imports: [SafeImageComponent, MatTooltip],
})
export class EventoCardDialogComponent {
  public readonly injectData: IDoCardGrid = inject(MAT_DIALOG_DATA);

  public readonly evento$ = signal<IDoListarEventos | null>(null);

  constructor(
    private readonly dialog: MatDialogRef<EventoCardDialogComponent>,
    private readonly pageService: PageListarEventosResourceService,
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService
  ) {
    this.pageService
      .listarEventosById({
        idEvent: this.injectData.id,
        idAccount: this.sessionService.getUserId() as number
      })
      .pipe(
        map((res) => mapFromListarEventosDtoToIDoListarEventos(res)),
        tap((res) => this.evento$.set(res))
      )
      .subscribe();
  }

  public editar() {
    this.routingService.goTo(
      this.routingService.goToEditEvent(this.injectData.id)
    );
    this.dialog.close(null);
  }
}