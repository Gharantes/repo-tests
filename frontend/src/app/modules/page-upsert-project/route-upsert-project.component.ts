import { Component, inject, signal } from '@angular/core';
import { RoutingService, SessionService, SnackbarService } from '@synergia-frontend/services';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ViewUpsertProjectComponent } from './view/view-upsert-project.component';
import { ConnectorUpsertProject } from './connector/connector-upsert-project';
import {
  EntityGetByIdResourceService,
  PageUpsertProjectResourceService,
  UpsertProjectDto
} from '@synergia-frontend/api';
import { EventDtoToModel, IUpsertProjectToDto, ProjectDtoToModel } from '@synergia-frontend/mappers';
import { map, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-route-upsert-project',
  standalone: true,
  templateUrl: './route-upsert-project.component.html',
  styleUrl: `./route-upsert-project.component.scss`,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    ViewUpsertProjectComponent,
  ],
  providers: [ConnectorUpsertProject],
})
export class RouteUpsertProjectComponent {
  public connector = inject(ConnectorUpsertProject);
  public idProject = signal<number | null>(null);

  constructor(
    private readonly sessionService: SessionService,
    private readonly routingService: RoutingService,
    private readonly snackbarService: SnackbarService,
    private readonly service: PageUpsertProjectResourceService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly entityService: EntityGetByIdResourceService,
  ) {
    this.getIdFromRoute()
  }
  private getIdFromRoute() {
    this.routingService
      .getParamFromRoute(this.activatedRoute, 'id')
      .then((id) => {
        this.idProject.set(id ? Number(id) : null);
        this.getById();
      });
  }
  public goToLastPage() {
    this.routingService.goToListProjects();
  }
  private getById() {
    const idProject = this.idProject()
    if (idProject == null) return;
    this.entityService.getProjectById(idProject).pipe(
      map(res => ProjectDtoToModel(res)),
      tap(res => this.connector.populateForm(res))
    ).subscribe()
  }

  public save() {
    const id = this.idProject()
    const params = this.connector.getFormValue()
    if (params == null) return

    if (id) {
      this.update(id, params)
    } else {
      this.insert(params)
    }
  }
  private insert(params: UpsertProjectDto) {
    this.service.createProject(params).pipe(
      tap(() => {
        this.snackbarService.showMessage("Projeto criado com sucesso.");
        this.goToLastPage()
      })
    ).subscribe()
  }
  private update(idProject: number, params: UpsertProjectDto) {
    this.service.updateProject(idProject, params).pipe(
      tap(() => {
        this.snackbarService.showMessage("Projeto atualizado com sucesso.");
        this.goToLastPage()
      })
    ).subscribe()
  }
}