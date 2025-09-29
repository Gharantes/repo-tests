import { Component, OnInit, signal } from '@angular/core';
import { AbsBaseRoute } from '@synergia-frontend/abstracts';
import { PageListarEventosResourceService, StatisticsResourceService } from '@synergia-frontend/api';
import { IDoListarEventos } from '@synergia-frontend/interfaces';
import {
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import { ListarEventosViewComponent } from '@synergia-frontend/views';
import { catchError, concatMap, EMPTY, map, tap } from 'rxjs';
import { mapFromListarEventosDtoToIDoListarEventosArray } from '@synergia-frontend/mappers';
import { MatDialog } from '@angular/material/dialog';
import { IDoCardGridEntryInteraction } from '@synergia-frontend/components';
import { EventoCardDialogComponent } from './evento-card/evento-card-dialog.component';

@Component({
  selector: 'app-page-listar-eventos-route',
  standalone: true,
  template: `
    <lib-page-listar-eventos-view
      [data$]="data$"
      (updateFiltrosEvent)="updateFiltros($event)"
      (toNewEventPageEvent)="toNewEventPageEvent()"
      (viewDetailsEvent)="viewDetails($event)"
      (deleteEntryEvent)="deleteEntry($event)"
      (editEntryEvent)="editEntry($event)"
      (cardInteractionEvent)="cardInteraction($event)"
    ></lib-page-listar-eventos-view>
  `,
  styleUrl: `./style.scss`,
  imports: [ListarEventosViewComponent],
})
export class ListarEventosRouteComponent implements AbsBaseRoute, OnInit {
  public readonly data$ = signal<IDoListarEventos[]>([]);

  constructor(
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService,
    private readonly pageService: PageListarEventosResourceService,
    private readonly statisticsService: StatisticsResourceService,
    private readonly snackService: SnackbarService,
    private readonly dialog: MatDialog,
  ) {}

  private filtros: Partial<{ textfield: string|undefined }> = {}
  public updateFiltros($event: Partial<{ textfield: string|undefined }>) {
    this.filtros = $event;
    this.getData().subscribe()
  }

  public ngOnInit() {
    this.setRouteInfo();
    this.getData().subscribe();
  }

  public setRouteInfo() {
    this.routingService.setRouteInfo(this.routingService.events());
  }
  public toNewEventPageEvent() {
    this.routingService.goTo(this.routingService.newEvents());
  }
  public getData() {
    return this.pageService
      .listarEventosAll({
        idTenant: this.sessionService.getTenantId() as number,
        idAccount: this.sessionService.getUserId() as number,
        text: this.filtros.textfield
      })
      .pipe(
        map((res) => mapFromListarEventosDtoToIDoListarEventosArray(res)),
        tap((res) => this.data$.set(res))
      );
  }

  public viewDetails($event: IDoListarEventos) {
    const destiny = this.routingService.eventDetails($event.id);
    this.routingService.goTo(destiny);
  }
  public editEntry($event: IDoListarEventos) {
    const destiny = this.routingService.editEvents($event.id);
    this.routingService.goTo(destiny);
  }
  public deleteEntry($event: IDoListarEventos) {
    this.pageService
      .deletarEvento($event.id)
      .pipe(
        catchError(() => {
          this.snackService.addMessage('Erro ao deletar Evento.');
          return EMPTY;
        }),
        concatMap(() => this.getData()),
        tap(() => this.snackService.addMessage('Evento deletado com sucesso.'))
      )
      .subscribe();
  }

  cardInteraction($event: IDoCardGridEntryInteraction) {
    this.statisticsService.registerView({
      entityRef: 'EVENT',
      idAccount: this.sessionService.getUserId() as number,
      idRef: $event.entry.id,
      idTenant: this.sessionService.getTenantId() as number
    }).pipe().subscribe();

    this.dialog.open(
      EventoCardDialogComponent,
      { data: $event.entry }
    ).afterClosed().pipe().subscribe();
  }
}