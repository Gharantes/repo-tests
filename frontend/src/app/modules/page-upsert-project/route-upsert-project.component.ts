import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RoutingService, SnackbarService } from '@synergia-frontend/services';
import { EntityProjectResourceService } from '@synergia-frontend/api';
import { tap } from 'rxjs';
import { ViewUpsertProjectComponent } from './view/view-upsert-project.component';
import { ConnectorUpsertProject } from './connector/connector-upsert-project';

/** Criar projeto. A edição de um projeto existente acontece em /project/:id (modo edição). */
@Component({
  selector: 'app-route-upsert-project',
  standalone: true,
  templateUrl: './route-upsert-project.component.html',
  styleUrl: `./route-upsert-project.component.scss`,
  imports: [ViewUpsertProjectComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [ConnectorUpsertProject],
})
export class RouteUpsertProjectComponent {
  public connector = inject(ConnectorUpsertProject);
  private readonly routingService = inject(RoutingService);
  private readonly snackbarService = inject(SnackbarService);
  private readonly entityProjectService = inject(EntityProjectResourceService);

  public goToLastPage() {
    this.routingService.goToListProjects();
  }

  public save() {
    const params = this.connector.getFormValue();
    if (params == null) return;

    this.entityProjectService
      .createProject(params)
      .pipe(
        tap(() => {
          this.snackbarService.showMessage('Projeto criado com sucesso.');
          this.goToLastPage();
        })
      )
      .subscribe();
  }
}
