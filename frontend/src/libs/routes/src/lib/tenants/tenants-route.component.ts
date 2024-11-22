import { Component, DestroyRef } from '@angular/core';
import { TenantDto, TenantResourceService } from '@synergia-frontend/api';
import { ExtendableTableComponent, IDoExtentendableTableColumnInfo } from '@synergia-frontend/tables';
import { debounceTime, Subject, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-tenants-route',
  standalone: true,
  template: `
    <lib-extendable-table
      [data$]="data$"
      [columns]="info"
    ></lib-extendable-table>
  `,
  styles: [],
  imports: [ExtendableTableComponent],
  providers: [],
})
export class TenantsRouteComponent {
  private readonly data$subject = new Subject<TenantDto[]>
  public readonly data$ = this.data$subject.asObservable();

  public readonly info: IDoExtentendableTableColumnInfo<TenantDto>[] = [
    { def: 'id', header: 'ID', value: (row) => row.id },
    { def: 'name', header: 'Name', value: (row) => row.name },
    { def: 'identifier', header: 'Identifier', value: (row) => row.identifier },
    { def: 'owner', header: 'Owner', value: (row) => row.owner },
  ]

  constructor(
    private readonly tenantRService: TenantResourceService,
    private readonly destroyRef: DestroyRef
  ) {
    this.watch();
    this.next();
  }

  private readonly updateTable$subject = new Subject<void>();

  public watch() {
    this.updateTable$subject.pipe(
      debounceTime(300),
      switchMap(() => this.populateTable()),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe()
  }
  public next() {
    this.updateTable$subject.next();
  }
  private populateTable() {
    return this.tenantRService.seeAllTenantsOnDatabase().pipe(
      tap((res) => this.data$subject.next(res)),
    )
  }
}