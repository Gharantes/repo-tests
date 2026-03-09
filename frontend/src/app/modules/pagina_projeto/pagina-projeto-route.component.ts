import { AfterViewInit, Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  CreateProjetoDto,
  PageCreateProjetoResourceService,
  PageListarUsuariosResourceService,
  StatisticsResourceService
} from '@synergia-frontend/api';
import {
  RoutingService,
  SessionService,
  SnackbarService,
} from '@synergia-frontend/services';
import { concatMap, tap } from 'rxjs';

@Component({
  selector: 'app-page-listar-usuarios-route',
  standalone: true,
  template: `
    <div>
        {{ projeto()?.title }}
    </div>
  `,
  styleUrl: `./style.scss`,
  imports: [],
})
export class PaginaProjetoRouteComponent implements AfterViewInit {
  public readonly projeto = signal<CreateProjetoDto | null>(null)

  private readonly idProjeto = signal<number | null>(null)
  constructor(
    private readonly sessionService: SessionService,
    private readonly snackService: SnackbarService,
    private readonly routingService: RoutingService,
    private readonly pageService: PageListarUsuariosResourceService,
    private readonly statisticsResourceService: StatisticsResourceService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly pageService2: PageCreateProjetoResourceService
  ) {}

    ngAfterViewInit(): void {
      this.getProjectInfo(); 
    }

  private getProjectInfo() {
    const promise = this.routingService.getParamFromRoute(this.activatedRoute, "id");
    promise.then((res) => {
      if (res == null || res == "") {
        this.routingService.goTo(this.routingService.projects());
        return
      } else {
        this.idProjeto.set(Number(res));
        this.getCreateProjectById();
      }
    });
  }
  private getCreateProjectById() {
    this.pageService2.getCreateProjetoDtoById(this.idProjeto()!).pipe(
      tap(res => this.projeto.set(res)),
      concatMap(() => this.statisticsResourceService.registerView({
        entityRef: 'PROJECT',
        idRef: this.idProjeto() as number,
        idAccount: this.sessionService.getUserId() as number,
        idTenant: this.sessionService.getTenantId() as number
      }))
    ).subscribe()
  }
}