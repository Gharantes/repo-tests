import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { EntityGetByIdResourceService, EntityProjectResourceService } from '@synergia-frontend/api';
import { PermissionService, RoutingService, SnackbarService } from '@synergia-frontend/services';
import { map, tap } from 'rxjs';
import { ProjectDtoToModel } from '@synergia-frontend/mappers';
import { IProjectModel } from '@synergia-frontend/interfaces';
import { ViewProjectDetailsComponent } from './view/view-project-details.component';
import { ConnectorUpsertProject } from '../page-upsert-project/connector/connector-upsert-project';

/**
 * Página do projeto. "Editar projeto" troca o topo da página (capa, título,
 * propriedades e descrição) por campos, sem sair daqui; as abas continuam abaixo.
 * `?edit=1` abre a página já em modo edição (é para onde aponta goToEditProject).
 */
@Component({
  selector: 'app-route-project-details',
  templateUrl: './route-project-details.component.html',
  styleUrl: `./route-project-details.component.scss`,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ViewProjectDetailsComponent],
  providers: [ConnectorUpsertProject],
})
export class RouteProjectDetailsComponent {
  public readonly connector = inject(ConnectorUpsertProject);
  private readonly routingService = inject(RoutingService);
  public readonly permissions = inject(PermissionService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly entityService = inject(EntityGetByIdResourceService);
  private readonly entityProjectService = inject(EntityProjectResourceService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly idProject = signal<number | null>(null);
  public readonly project$ = signal<IProjectModel | null>(null);
  public readonly editing = signal(false);
  /** `?tab=lousa|eventos|calendario`: muda de aba mesmo com a página já aberta (aviso do sino). */
  public readonly openTab = toSignal(this.activatedRoute.queryParamMap.pipe(map((q) => q.get('tab'))), {
    initialValue: null,
  });

  constructor() {
    this.getFromRouteParams();
  }

  /**
   * O Angular reaproveita o componente quando só o :id muda
   * (ex.: /project/5 -> /project/6), então é preciso ouvir o paramMap
   * continuamente em vez de ler só o primeiro valor.
   */
  private getFromRouteParams() {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const id = params.get('id');
        if (id == null) {
          this.routingService.goToListProjects();
          return;
        }
        this.idProject.set(Number(id));
        this.editing.set(false);
        this.lookupProject(this.activatedRoute.snapshot.queryParamMap.has('edit'));
      });
  }

  public lookupProject(openEditing = false) {
    const idProject = this.idProject();
    if (idProject == null) return;
    const lookupTags = true;
    const lookupMembers = true;

    this.entityService
      .getProjectById(idProject, lookupTags, lookupMembers)
      .pipe(
        map((res) => ProjectDtoToModel(res)),
        tap((res) => {
          this.project$.set(res);
          if (openEditing) this.startEditing();
        })
      )
      .subscribe();
  }

  public goToList() {
    this.routingService.goToListProjects();
  }

  public startEditing() {
    const project = this.project$();
    if (project == null) return;
    if (!this.permissions.canEditProject(project)) {
      this.clearEditParam();
      return;
    }
    this.connector.populateForm(project);
    this.editing.set(true);
    this.clearEditParam();
  }

  public cancelEditing() {
    this.editing.set(false);
  }

  public save() {
    const id = this.idProject();
    const params = this.connector.getFormValue();
    if (id == null || params == null || this.connector.form.invalid) return;

    this.entityProjectService
      .updateProject(id, params)
      .pipe(
        tap(() => {
          this.snackbarService.showMessage('Projeto atualizado com sucesso.');
          this.editing.set(false);
          this.lookupProject();
        })
      )
      .subscribe();
  }

  /** Tira o ?edit=1 da URL, para que recarregar a página depois de salvar não volte ao modo edição. */
  private clearEditParam() {
    if (!this.activatedRoute.snapshot.queryParamMap.has('edit')) return;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { edit: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
