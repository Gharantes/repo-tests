import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { AbsBaseRoute } from '@synergia-frontend/abstracts';
import {
    CreateProjetoDto,
  ListarUsuariosBasicInfoDto,
  PageCreateProjetoResourceService,
  PageListarUsuariosResourceService,
} from '@synergia-frontend/api';
import { IDoBasicUsuarioInfo } from '@synergia-frontend/interfaces';
import {
  RoutingService,
  SessionService,
  Snackbar2Service,
} from '@synergia-frontend/services';
import { ListarUsuariosViewComponent } from '@synergia-frontend/views';
import { catchError, concatMap, EMPTY, map, tap } from 'rxjs';

@Component({
  selector: 'app-page-listar-usuarios-route',
  standalone: true,
  template: `
    <div>
        {{ projeto()?.title }}
    </div>
  `,
  styleUrl: `./style.scss`,
  imports: [ListarUsuariosViewComponent],
})
export class PaginaProjetoRouteComponent implements AfterViewInit {
  public readonly projeto = signal<CreateProjetoDto | null>(null)

  private readonly idProjeto = signal<number | null>(null)
  constructor(
    private readonly sessionService: SessionService,
    private readonly snackService: Snackbar2Service,
    private readonly routingService: RoutingService,
    private readonly pageService: PageListarUsuariosResourceService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly pageService2: PageCreateProjetoResourceService
  ) {}

    ngAfterViewInit(): void {
        this.routingService.getParamFromRoute(this.activatedRoute, "id").then((res) => {
            if (res == null || res == "") {
                this.routingService.goTo(this.routingService.projects());
                return
            } else {
                this.idProjeto.set(Number(res));
                this.pageService2.getCreateProjetoDtoById(this.idProjeto()!).pipe(
                    tap(res => {
                        this.projeto.set(res);
                    })
                ).subscribe()
            }
        });
    }
}