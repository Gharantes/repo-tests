import { Component, DestroyRef, inject, signal } from '@angular/core';
import { EntityDeleteByIdResourceService, EntityTagResourceService } from '@synergia-frontend/api';
import { RoutingService, SessionService, SnackbarService } from '@synergia-frontend/services';
import { catchError, debounceTime, EMPTY, map, tap } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ConnectorListTags } from './connector/connector-list-tags';
import { ViewListTagsComponent } from './view/view-list-tags.component';
import { TagDtoToModel } from '@synergia-frontend/mappers';
import { ITagModel } from '@synergia-frontend/interfaces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-route-list-tags',
  standalone: true,
  templateUrl: './route-list-tags.component.html',
  styleUrl: `./route-list-tags.component.scss`,
  imports: [ReactiveFormsModule, ViewListTagsComponent],
  providers: [ConnectorListTags]
})
export class RouteListTagsComponent {
  public readonly data$ = signal<ITagModel[]>([]);
  public readonly connector = inject(ConnectorListTags);

  constructor(
    private readonly entityTagService: EntityTagResourceService,
    private readonly deleteEntityService: EntityDeleteByIdResourceService,
    private readonly sessionService: SessionService,
    private readonly snackbarService: SnackbarService,
    private readonly destroyRef: DestroyRef,
    private readonly routingService: RoutingService
  ) {
    this.searchForTags();
    this.watchForm();
  }

  public createTag() {
    this.routingService.goToCreateTag()
  }
  public deleteTag($event: ITagModel) {
    this.deleteEntityService.deleteTagById($event.id).pipe(
      tap(() => this.searchForTags()),
      catchError(err => {
        this.snackbarService.catchError(err);
        return EMPTY
      })
    ).subscribe()
  }
  public editTag($event: ITagModel) {
    this.routingService.goToEditTag($event.id)
  }

  public searchForTags() {
    const idTenant = this.sessionService.getTenantId() as number;
    const text = this.connector.textFieldControl.value;

    this.entityTagService
      .listTagsByTenant(
        idTenant,
        false,
        false,
        false,
        text
      )
      .pipe(
        map((res) => res.map(v => TagDtoToModel(v))),
        tap((res) => this.data$.set(res))
      )
      .subscribe();
  }

  public watchForm() {
    this.connector.textFieldControl.valueChanges
      .pipe(
        debounceTime(400),
        tap(() => this.searchForTags()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

}