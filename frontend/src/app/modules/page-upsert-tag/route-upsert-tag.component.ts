import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ViewUpsertTagComponent } from './view/view-upsert-tag.component';
import { ConnectorUpsertTag } from './connector/connector-upsert-tag';
import { RoutingService, SnackbarService } from '@synergia-frontend/services';
import { ActivatedRoute } from '@angular/router';
import { EntityGetByIdResourceService, EntityTagResourceService } from '@synergia-frontend/api';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'app-route-upsert-tag',
  standalone: true,
  templateUrl: './route-upsert-tag.component.html',
  styleUrl: `./route-upsert-tag.component.scss`,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    ViewUpsertTagComponent,
  ],
  providers: [ConnectorUpsertTag],
})
export class RouteUpsertTagComponent {
  public readonly connector = inject(ConnectorUpsertTag);
  public readonly routingService = inject(RoutingService);
  public readonly activatedRoute = inject(ActivatedRoute);
  public readonly snackbarService = inject(SnackbarService);
  public readonly entityGetByIdService = inject(EntityGetByIdResourceService);
  public readonly entityTagService = inject(EntityTagResourceService);

  public readonly idTag = signal<number | null>(null);

  constructor() {
    this.routingService
      .getParamFromRoute(this.activatedRoute, 'id')
      .then((id) => {
        id ? this.idTag.set(Number(id)) : undefined;
        this.fillForm()
      });
  }
  public save() {
    const id = this.idTag();
    if (id == null) {
      this.insert();
    } else {
      this.update(id);
    }
  }
  private insert() {
    const obj = this.connector.getFormValue();
    this.entityTagService
      .createTag(obj)
      .pipe(
        tap(() => {
          this.goToParentPage();
          this.snackbarService.showMessage('Tag criada com sucesso.');
        }),
        catchError(err => {
          this.snackbarService.catchError(err);
          return EMPTY
        })
      )
      .subscribe();
  }
  private update(idTag: number) {
    const obj = this.connector.getFormValue();
    this.entityTagService
      .updateTag(idTag, obj)
      .pipe(
        tap(() => {
          this.goToParentPage();
          this.snackbarService.showMessage('Tag atualizada com sucesso.');
        }),
        catchError((err) => {
          this.snackbarService.catchError(err);
          return EMPTY;
        })
      )
      .subscribe();
  }
  public goToParentPage() {
    this.routingService.goToListTags();
  }
  public fillForm() {
    const id = this.idTag();
    if (id == null) return;
    this.entityGetByIdService.getTagById(id).pipe(
      tap(res => {
        this.connector.setFormValue(res)
      }),
      catchError(err => {
        this.snackbarService.catchError(err)
        return EMPTY
      })
    ).subscribe()
  }
}