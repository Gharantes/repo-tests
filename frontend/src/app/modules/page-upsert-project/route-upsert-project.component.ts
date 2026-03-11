import { Component, inject } from '@angular/core';
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
import { PageUpsertProjectResourceService } from '@synergia-frontend/api';
import { IUpsertProjectToDto } from '@synergia-frontend/mappers';
import { tap } from 'rxjs';

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

  constructor(
    private readonly sessionService: SessionService,
    private readonly routingService: RoutingService,
    private readonly snackbarService: SnackbarService,
    private readonly service: PageUpsertProjectResourceService
  ) {}
  public goToLastPage() {
    this.routingService.goToListProjects();
  }
  public salvar() {
    const obj = this.connector.getFormValue()
    if (obj == null) return
    const params = IUpsertProjectToDto(obj)
    this.service.createProject(params).pipe(
      tap(() => {
        this.snackbarService.showMessage("Projeto criado com sucesso.");
        this.goToLastPage()
      })
    ).subscribe()
  }
}