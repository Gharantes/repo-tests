import { Component, OnInit, signal } from '@angular/core';
import { AbsBaseRoute } from '@synergia-frontend/abstracts';
import {
  ListarProjetosAllDto,
  PageListarProjetosResourceService
} from '@synergia-frontend/api';
import { IDoBasicProjectInfo } from '@synergia-frontend/interfaces';
import {
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import { ListarProjetosViewComponent } from '@synergia-frontend/views';
import { catchError, concatMap, EMPTY, map, tap } from 'rxjs';

@Component({
  selector: 'app-page-listar-projetos-route',
  standalone: true,
  template: `
    <lib-page-listar-projetos-view
      [data$]="data$"
      (toNewProjectsPageEvent)="toNewProjectsPage()"
      (deleteEntryEvent)="deleteEntry($event)"
      (editEntryEvent)="editEntry($event)"
    ></lib-page-listar-projetos-view>
  `,
  styleUrl: `./style.scss`,
  imports: [ListarProjetosViewComponent],
})
export class ListarProjetosRouteComponent implements AbsBaseRoute, OnInit {
  public readonly data$ = signal<IDoBasicProjectInfo[]>([]);

  constructor(
    private readonly snackService: SnackbarService,
    private readonly routingService: RoutingService,
    private readonly sessionService: SessionService,
    private readonly pageService: PageListarProjetosResourceService
  ) {}

  public ngOnInit(): void {
    this.setRouteInfo();
    this.getData().subscribe();
  }
  public setRouteInfo(): void {
    this.routingService.setRouteInfo(this.routingService.projects());
  }
  public toNewProjectsPage() {
    return this.routingService.goTo(this.routingService.newProjects());
  }

  public getData() {
    return this.pageService
      .listarProjetosAll({
        idTenant: this.sessionService.getTenantId() as number,
        idAccount: this.sessionService.getUserId() as number
      })
      .pipe(
        catchError(() => {
          this.snackService.addMessage('Erro ao listar projetos');
          return EMPTY;
        }),
        map((res) => this.mapResponse(res)),
        tap((res) => this.data$.set(res))
      );
  }
  private mapResponse(
    res: ListarProjetosAllDto[]
  ): IDoBasicProjectInfo[] {
    return res.map((v) => ({
      id: v.id,
      description: v.description,
      title: v.title,
    }));
  }

  public deleteEntry(el: IDoBasicProjectInfo) {
    this.pageService
      .deletarProjeto(el.id)
      .pipe(
        catchError(() => {
          this.snackService.addMessage('Erro ao deletar projeto.');
          return EMPTY;
        }),
        concatMap(() => this.getData()),
        tap(() => this.snackService.addMessage('Projeto deletado com sucesso.'))
      )
      .subscribe();
  }

  editEntry($event: IDoBasicProjectInfo) {
    this.routingService.goTo(this.routingService.editProject($event.id));
  }
}