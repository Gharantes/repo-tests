import { Component, signal } from '@angular/core';
import { SigExtendableTableComponent } from '@synergia-frontend/components';
import {
  IDoExtendableTableActions,
  IDoExtendableTableColumnInfo,
  IDoListarTags
} from '@synergia-frontend/interfaces';
import { PageListarTagsResourceService } from '@synergia-frontend/api';
import { SessionService, SnackbarService } from '@synergia-frontend/services';
import { catchError, debounceTime, EMPTY, map, tap } from 'rxjs';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { listarTagsDtoToIDoArray } from '@synergia-frontend/mappers';

@Component({
  selector: 'app-listar-tags-route',
  standalone: true,
  template: `
    <div id="topline">
      <mat-form-field class="field" [appearance]="'outline'">
        <mat-label>Nome</mat-label>
        <input type="text" matInput [formControl]="textfieldControl" />
      </mat-form-field>
      <button (click)="createTag()">Criar</button>
    </div>

    <lib-sig-extendable-table
      [actions]="actions"
      [columns]="columns"
      [data$]="data$"
    ></lib-sig-extendable-table>
  `,
  styleUrl: `./style.scss`,
  imports: [
    SigExtendableTableComponent,
    MatInput,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
  ],
})
export class ListarPermissoesRouteComponent {
  public readonly data$ = signal<IDoListarTags[]>([]);

  public readonly textfieldControl: FormControl<string>;

  constructor(
    private readonly pageService: PageListarTagsResourceService,
    private readonly sessionService: SessionService,
    private readonly snackbarService: SnackbarService,
    private readonly fb: NonNullableFormBuilder
  ) {
    this.textfieldControl = this.fb.control('');
    this.searchForTags();
    this.watchTextfieldControl();
  }

  private watchTextfieldControl() {
    this.textfieldControl.valueChanges.pipe(
      debounceTime(400),
      tap(() => this.searchForTags())
    ).subscribe()
  }

  private searchForTags() {
    this.pageService
      .listarTagsAll({
        idTenant: this.sessionService.getTenantId() as number,
        text: this.textfieldControl.value,
      })
      .pipe(
        map((res) => listarTagsDtoToIDoArray(res)),
        tap((res) => this.data$.set(res))
      )
      .subscribe();
  }
  public readonly columns: IDoExtendableTableColumnInfo<IDoListarTags>[] = [
    { def: 'name', header: 'Nome', value: (el) => el.name },
    { def: 'created_at', header: 'Criada em', value: (el) => el.createdAt },
  ];
  public readonly actions: IDoExtendableTableActions<IDoListarTags>[] = [
    {
      icon: '',
      label: 'Excluir',
      isAllowed: () => true,
      action: (el) => { this.deleteTag.bind(this)(el.id) }
    }
  ]

  private deleteTag(id: number) {
    this.pageService.deleteTag(id).pipe(
      tap(() => this.searchForTags())
    ).subscribe();
  }
  public createTag() {
    this.pageService
      .insertTag({
        idTenant: this.sessionService.getTenantId() as number,
        name: this.textfieldControl.value,
      })
      .pipe(
        catchError((err) => {
          this.snackbarService.catchError(err);
          return EMPTY;
        }),
        tap(() => this.searchForTags())
      )
      .subscribe();
  }
}